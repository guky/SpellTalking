var userid;
var recievers;
window.onload= init;

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
		alert('Giving up :( Cannot create an XMLHTTP instance');
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
	//alert(userid);
	requestToken();
	//alert("tokenOpen");
	
}




requestToken = function(){
	var getTokenURI = '/gettoken';
	$.ajax({
		  type: "POST",
		  url: getTokenURI,
		  //data: { name: "John", location: "Boston" 
			
		}).done(function( msg ) {
			//alert(msg);
		  openChannel(msg);
		  displayFriendList();
		});
};

openChannel = function(token) {
	var channel = new goog.appengine.Channel(token);
	var socket = channel.open();
	socket.onopen = onSocketOpen;
	socket.onmessage = onSocketMessage;
	socket.onerror = onSocketError;
	socket.onclose = onSocketClose;
};

onSocketError = function(error){
	alert("Error is <br/>"+error.description+" <br /> and HTML code"+error.code);
};

onSocketOpen = function() {
	// socket opened
};

onSocketClose = function() {
	alert("Socket Connection closed");
};

onSocketMessage = function(message) {
	
	var messageXML =  ((new DOMParser()).parseFromString(message.data, "text/xml"));
	
	var messageType = messageXML.documentElement.getElementsByTagName("type")[0].firstChild.nodeValue;
	//alert(messageType);
	if(messageType == "updateFriendList"){
		addToFriends(messageXML.documentElement.getElementsByTagName("message")[0].firstChild.nodeValue);
	}else if(messageType == "updateChatBox"){
		var friend = messageXML.documentElement.getElementsByTagName("from")[0].firstChild.nodeValue ;		
		updateChatBox(messageXML.documentElement.getElementsByTagName("message")[0].firstChild.nodeValue,friend);
	}
};


displayFriendList =function(){
	var txt = document.createElement("div");		
	document.getElementById("FriendList").appendChild(txt);	
	var getFriendListURI = 'getFriendList?userid='+ userid;
	var httpRequest = makeRequest(getFriendListURI,false);
	if (httpRequest.readyState === 4) {
		if (httpRequest.status === 200) {
			var friendListXML = httpRequest.responseXML.getElementsByTagName("friend");
			for( var i =0 ; i < friendListXML.length ; i++){
				addToFriends(friendListXML[i].getElementsByTagName("name")[0].firstChild.nodeValue);
			}
			
		}else {
			alert('There was a problem with the request.');
		}
	}
};


var friendsList= new Array();


addToFriends = function(friend){
	//check if the user already added
	var contains = false;
	for(var i = 0 ; i < friendsList.length ; i++){
		if(friendsList[i]==friend){
			contains=true;
			break;
		}
	}
	if(!contains){
		friendsList.push(friend);
		var a = "<a id='"+friend+"'>"+friend+"</a>";
		var txt = document.createElement("div");
		txt.innerHTML = a;
		txt.style.cursor="pointer";
		txt.setAttribute("onclick","openChat(\""+friend+"\");");
		document.getElementById("FriendList").appendChild(txt);

		
		

		




		//document.getElementById("chatMessagesPage").appendChild(chatBox);
		//recievers[recievers.lenght] = friend;
	}
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
	console.debug(message);
	message = message.split('<').join('lt').split('>').join('gt');
	console.debug(message);
	var sendMessageURI = '/message?message=' + message + '&to=test2@example.com' + '&from='+userid ;
	$.ajax({
		  type: "POST",
		  url: sendMessageURI,
		  data: { message: message}
			
		}).done(function( msg ) {
			
		
		});
	var mesgDiv = document.createElement("a");
	mesgDiv.innerHTML ="<b>me</b>:  "+ message+"<br />";
	var abc = document.getElementById("messageCont");
	if(abc){
		abc.appendChild(mesgDiv);}
	else{
		alert("error");}
	//tinyMCE.get('messageBox').setContent('');
	document.getElementById("messageBox").value = '';
	
}

updateChatBox = function(message,from){
	
	var mesgDiv = document.createElement("a");
	if(from!=userid){
	mesgDiv.innerHTML ="<b>"+from+"</b>:  "+ message+"<br />";
	var abc = document.getElementById("messageCont");
	if(abc)
		abc.appendChild(mesgDiv);	
		//abc.value = abc.value + message;
	
	else
		alert("error");
}
};
