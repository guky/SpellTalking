var userid;
var recievers;
var volume = 50;
var songList;
window.onload= init;
var sound = new Audio("msg.wav");
sound.setAttribute('type', 'audio/mp3');
sound.preload = 'auto';
sound.load();

function playSound() {
  var click=sound;
  click.volume = volume/100;
  click.play();
}
//general ajax function for all requests 
function makeRequest(url,async) {
	var httpRequest;
	if (window.XMLHttpRequest) {
		// Mozilla, Safari, ...
		httpRequest = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		// IE
		try {
			httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} 
		catch (e) {
			try {
				httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} 
			catch (e) {}
		}
	}

	if (!httpRequest) {
		console.debug('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	httpRequest.open('POST', url,async);
	httpRequest.send();
	return httpRequest;
}


function init(){
	//document.getElementById("initLoginBtn").onclick = showLoginPage;
	//document.getElementById("loginBtn").onclick = loginUser;
	userid = document.getElementById("userid").innerHTML;	
	//console.debug(userid);
	requestToken();
	getHistory();
	//console.debug("tokenOpen");
	
}




requestToken = function(){
	var getTokenURI = '/gettoken?forced=false';
	$.ajax({
		  type: "POST",
		  url: getTokenURI,
		  //data: { name: "John", location: "Boston" 
			
		}).done(function( msg ) {
			//console.debug(msg);
		  openChannel(msg);
		  displayFriendList();
		 
		});
};

openChannel = function(token) {
	console.debug("Open Channel started");
	var channel = new goog.appengine.Channel(token);
	var socket = channel.open();
	socket.onopen = onSocketOpen;
	socket.onmessage = onSocketMessage;
	socket.onerror = onSocketError;
	socket.onclose = onSocketClose;
};

onSocketError = function(error){
	console.debug("Error is <br/>"+error.description+" <br /> and HTML code"+error.code);
	addSystemMessage("Error: "+error.description+" Code: "+error.code,dateFormat());
	var getTokenURI = '/gettoken?forced=true';
	$.ajax({
		  type: "POST",
		  url: getTokenURI,
		  //data: { name: "John", location: "Boston" 
			
		}).done(function( msg ) {
			//console.debug(msg);
		  openChannel(msg);		 
		});
};

onSocketOpen = function() {
	addSystemMessage("Socket is open",dateFormat());
	// socket opened
};

onSocketClose = function() {
	addSystemMessage("Socket Connection closed",dateFormat());
};

onSocketMessage = function(message) {
	var date;
	var messageXML =  ((new DOMParser()).parseFromString(message.data, "text/xml"));
	var friend;
	var from;
	var nick;
	var color;
	var messageType = messageXML.documentElement.getElementsByTagName("type")[0].firstChild.nodeValue;
	//console.debug(messageType);
	if(messageType == "addToFriendList"){
		color = messageXML.documentElement.getElementsByTagName("color")[0].firstChild.nodeValue;
		nick = messageXML.documentElement.getElementsByTagName("nick")[0].firstChild.nodeValue;
		friend = messageXML.documentElement.getElementsByTagName("message")[0].firstChild.nodeValue;
		date = messageXML.documentElement.getElementsByTagName("date")[0].firstChild.nodeValue;	
		addToFriends(friend,nick,date,color);
		addSystemMessage(nick+" joined",date);
	}else if(messageType == "nickNameChange"){
		color = messageXML.documentElement.getElementsByTagName("color")[0].firstChild.nodeValue;
		 nick = messageXML.documentElement.getElementsByTagName("message")[0].firstChild.nodeValue ;	
		 from = messageXML.documentElement.getElementsByTagName("from")[0].firstChild.nodeValue ;	
		 date = messageXML.documentElement.getElementsByTagName("date")[0].firstChild.nodeValue;
		 console.debug("date "+date);
		 changeNick(nick,from,date);
	}else if(messageType == "colorChange"){		
		 color = messageXML.documentElement.getElementsByTagName("message")[0].firstChild.nodeValue ;	
		 from = messageXML.documentElement.getElementsByTagName("from")[0].firstChild.nodeValue ;	
		 date = messageXML.documentElement.getElementsByTagName("date")[0].firstChild.nodeValue;
		 console.debug("date "+date);
		 colorChange(color,from,date);
	}else if(messageType == "updateChatBox"){	
		
		color = messageXML.documentElement.getElementsByTagName("color")[0].firstChild.nodeValue;
		//alert(color); 
		friend = messageXML.documentElement.getElementsByTagName("from")[0].firstChild.nodeValue ;	
		 date = messageXML.documentElement.getElementsByTagName("date")[0].firstChild.nodeValue;
		 console.debug("date "+date);
		 updateChatBox(messageXML.documentElement.getElementsByTagName("message")[0].firstChild.nodeValue,friend,date,color);
	}else if(messageType == "removeFromFriendList"){
		date = messageXML.documentElement.getElementsByTagName("date")[0].firstChild.nodeValue;
		nick = messageXML.documentElement.getElementsByTagName("nick")[0].firstChild.nodeValue;
		friend = messageXML.documentElement.getElementsByTagName("message")[0].firstChild.nodeValue;
		console.debug("date removeFromFriendList "+date);
		removeFromFriends(friend,nick,date);
	}
};


displayFriendList =function(){
	console.debug("List requested");
	var txt = document.createElement("div");		
	document.getElementById("FriendList").appendChild(txt);	
	var getFriendListURI = 'getFriendList?userid='+ userid;
	var httpRequest = makeRequest(getFriendListURI,false);
	if (httpRequest.readyState === 4) {
		if (httpRequest.status === 200) {
			var friendListXML = httpRequest.responseXML.getElementsByTagName("friend");
			for( var i =0 ; i < friendListXML.length ; i++){
				var color = friendListXML[i].getElementsByTagName("color")[0].firstChild.nodeValue
				addToFriends(friendListXML[i].getElementsByTagName("email")[0].firstChild.nodeValue,friendListXML[i].getElementsByTagName("name")[0].firstChild.nodeValue,dateFormat(),color);
			}
			
		}else {
			console.debug('There was a problem with the request.');
		}
	}
};


var friendsList= new Array();


addToFriends = function(friend,nick,date,color){
	//check if the user already added
	var element =  document.getElementById(friend);
	if (typeof(element) != 'undefined' && element != null)
	{
		contains = true;
	}else{
		contains = false;
	}
	console.debug("Friend add called");
	if(!contains){			
		var a = "<a id='"+friend+"' style='color:"+color+"'><b>"+nick+"</b></a>";
		var txt = document.createElement("div");
		txt.innerHTML = a;
		txt.style.cursor="pointer";
		txt.setAttribute("onclick","openChat(\""+friend+"\");");
		document.getElementById("FriendList").appendChild(txt);
	
		
		

		




		//document.getElementById("chatMessagesPage").appendChild(chatBox);
		//recievers[recievers.lenght] = friend;
	}
};

removeFromFriends = function(friend,nick,date){
	//check if the user already added
	var element =  document.getElementById(friend);
	if (typeof(element) != 'undefined' && element != null)
	{
		contains = true;
	}else{
		contains = false;
	}
	console.debug("contains: "+contains);
	if(contains){		
		document.getElementById("FriendList").removeChild(document.getElementById(friend).parentNode);
		addSystemMessage(nick+" left",date);
		//document.getElementById("chatMessagesPage").appendChild(chatBox);
		//recievers[recievers.lenght] = friend;
	}
};
changeNick = function(nick,friend,date){
	//check if the user already added
		console.debug("Friend nick change called to :"+nick);
		document.getElementById(friend).innerHTML = '<b>'+nick+'<b>'
		addSystemMessage(friend+" changed name to "+nick,date);
		//document.getElementById("chatMessagesPage").appendChild(chatBox);
		//recievers[recievers.lenght] = friend;
	
};
colorChange = function(color,friend,date){
	//check if the user already added
		console.debug("Friend color change called to :"+color);
		document.getElementById(friend).style.color = color;
		addSystemMessage(friend+" color changed",date);
		//document.getElementById("chatMessagesPage").appendChild(chatBox);
		//recievers[recievers.lenght] = friend;
	
};

closeWindow = function(friend){
	document.getElementById(friend+"chatBox").style.display="none";
}

openChat = function(friend){
	document.getElementById(friend+"chatBox").style.display = "block";
	document.getElementById(friend+"textarea").focus();
}

sendMessage = function(){
	
	//var message = tinyMCE.get('messageBox').getContent();
	var message =  document.getElementById("messageBox").value;
	message = message.replace(/^[ ]*/,'').replace(/^[\n]*/,'');
	var re = /^[/]/;	
	if(re.test(message)){
		
		commandParser(message);
	}else{
	console.debug(message);
	//message = message.split('<').join('lt').split('>').join('gt');
	console.debug(message);
	var sendMessageURI = '/message?action=1&to=test2@example.com' + '&from='+userid ;
	$.ajax({
		  type: "POST",
		  url: sendMessageURI,
		  data: { message: message}
			
		}).done(function( msg ) {
			
		
		});

	
	}	
	document.getElementById("messageBox").value = '';
}
getHistory = function(){
	
	
	console.debug("History");
	var sendMessageURI = '/message?action=2';
	$.ajax({
		  type: "POST",
		  url: sendMessageURI,
		//  data: { message: message}
		  
		  error: function (xhr, ajaxOptions, thrownError) {
		        alert(xhr.status);
		        alert(thrownError);
		        console.debug(thrownError);
		      }
		}).done(function( msg ) {
			console.debug("Done History fetch");
			
			console.debug(msg);
			var from;
			var text;
			//xmlDoc = $.parseXML( msg ),
		    //$xml = $( xmlDoc ),
			
			//var messageXML =  ((new DOMParser()).parseFromString(msg.data, "text/xml"));
			var messages = msg.documentElement.getElementsByTagName("message");
			console.debug(messages[0]);
			
			
			for(i = 0;i<messages.length;i++){
				//try{
				color = messages[i].getElementsByTagName("color")[0].firstChild.nodeValue;
				from = messages[i].getElementsByTagName("from")[0].firstChild.nodeValue;
				text = messages[i].getElementsByTagName("messageText")[0].firstChild.nodeValue;
				date = messages[i].getElementsByTagName("date")[0].firstChild.nodeValue;
				console.debug("color "+color);
				console.debug("from "+from);
				console.debug("text "+text);
				var mesgDiv = document.createElement("a");
				mesgDiv.innerHTML ="<b class='userColor' style='color:"+color+"'>"+date+' - '+from+"</b>:  "+ text+"<br />";
				console.debug(mesgDiv);
				var abc = document.getElementById("messageCont");	
					abc.appendChild(mesgDiv);
				  var elem = $('#messageCont');
				  elem.scrollTop(elem[0].scrollHeight);
				//}catch(err){
					//addSystemMessage('Error in history message',dateFormat());
				//}
			}
			
		});
	
}
updateChatBox = function(message,from,date,color){
	console.debug("Updatecalled");
	playSound();
	var mesgDiv = document.createElement("a");
	
	mesgDiv.innerHTML ="<b class='userColor' style='color:"+color+"'>"+date+' - '+from+"</b>:  "+ message+"<br />";
	console.debug(mesgDiv);
	var abc = document.getElementById("messageCont");	
		abc.appendChild(mesgDiv);
	  var elem = $('#messageCont');
	  elem.scrollTop(elem[0].scrollHeight);
	  
};
addSystemMessage = function(message,date){
	playSound();
	var mesgDiv = document.createElement("a");
	mesgDiv.innerHTML ="<b class='system'>&laquo;"+date+" - System &raquo;:  "+ message+"</b><br />";
	var abc = document.getElementById("messageCont");
	abc.appendChild(mesgDiv);
	var elem = $('#messageCont');
	console.debug("scrolling");
	elem.scrollTop(elem[0].scrollHeight);
};
function dateFormat(){
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	if(h < 10 || 0){
		var strH = '0'+h;
	}else{
		var strH = h;
	}
	if(m < 10 || 0){
		var strM = '0'+m;
	}else{
		var strM = m;
	}
	if(s < 10 || 0){
		var strS = '0'+s;		
	}else{
		strS = s;
	}
	return strH+":"+strM+":"+strS;
	
	
}
var controllPressed = false;
function keyPressed(event){
	if(event.keyCode == 13){
		sendMessage();
	}
	if(event.keyCode == 39){
		if(controllPressed){
		playNext();
		}
	}
	if(event.keyCode == 37){
		if(controllPressed){
		playPrev();
		}
	}
	if(event.keyCode == 17){
		controllPressed = true;		
	}
	
}
function keyReleased(event){
	if(event.keyCode == 17){
		controllPressed = false;		
	}
	
}	
	
