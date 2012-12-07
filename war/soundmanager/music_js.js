var songProgressLine;
var songProgressBar;
var volumeLine;
var volumeBar;
var songDuration;
var currentSong;
var currentTitle;
var songsLoaded;
var playList;
var audioPlayer;
var randomize = false;
function doLogin() {    	
    	  VK.Auth.getLoginStatus(function(response) {
          if (response.session) {
           
          } else {
             VK.Auth.login(
    	    null,
    	    VK.access.AUDIO 
    	  );
          }
        });
    	}
		
      function loginOpenAPI() {
    	  getInitData();
    	}
	  
      function getInitData() {
    	  VK.Api.call('audio.get', {}, function(r) {
          	  if(r.response) {
          		songList = r.response;
          		console.debug(r.response);
          		//current.song = new Audio(r.response[0].url);
          		current.pos = 0;
          		//current.song.setAttribute('type', 'audio/mp3');
          		//current.song.play();
				
				if(isCookieSet("volume")){
				volume = getCookie("volume");
				console.debug("From cookies "+volume);				
				}else{
				setCookie("volume",50,10);				
				console.debug("From code "+volume);		
				}
							
				soundManager.setup({
					url: 'soundmanager/',
					flashVersion: 9, // optional: shiny features (default = 8)
					useFlashBlock: false, // optionally, enable when you're ready to dive in
					debugMode: false,
					
					onready: function() {
					console.debug("started sound creating");
					var s = soundManager.createSound({
					id: songList[current.pos].aid.toString(),			
					url: songList[current.pos].url,
					autoLoad: true
					});
					initPlayer();
					
					soundManager.play(songList[current.pos].aid.toString(),{"onfinish":playNext,"whileplaying":updateSongProgress});
					soundManager.pauseAll();
					},
					defaultOptions: {   
					"volume": volume
					},
				});
          	
			
        
          	  }
          	});
    	}
    	function playNext() {
		var s;
    		soundManager.stopAll();
    		if(current.pos+1 == songList.length){
			    current.pos = 0;
				current.pos = getPosition(current.pos);
    			playThis(songList[current.pos].aid.toString(),current.pos); 
						
    		}else{
    			current.pos = current.pos+1;
				current.pos = getPosition(current.pos);
    			playThis(songList[current.pos].aid.toString(),current.pos);
    		}
    		
			
        	 
        }
    	
    	function playPrev() {
		var s;
    		soundManager.stopAll();
    		if(current.pos == 0){
    			current.pos = songList.length-1;
				current.pos = getPosition(current.pos);
    			playThis(songList[current.pos].aid.toString(),current.pos);	
    			
    		}else{
    			current.pos = current.pos-1;
				current.pos = getPosition(current.pos);
    			playThis(songList[current.pos].aid.toString(),current.pos);
    		}
			
      }
       	function play() {
			var s = soundManager.togglePause(songList[current.pos].aid.toString());
			  if(s != null){
				if(s.paused){
					playButtonCurrent.src='soundmanager/play.png';
				}else{
					playButtonCurrent.src='soundmanager/pause.png';
				}
			  }
        	  
        	  
        }
		function getCookie(c_name)
		{
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++)
		  {
		  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		  x=x.replace(/^\s+|\s+$/g,"");
		  if (x==c_name)
			{
			return unescape(y);
			}
		  }
		}

		function setCookie(c_name,value,exdays)
		{
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=c_name + "=" + c_value;
		}

		function isCookieSet(name)
		{
		var cookie=getCookie(name);
		if (cookie!=null && cookie!="")
		  {
			return true;
		  }
		else 
		  {
			return false;
		  }
		}
    function initPlayer(){	
	
	 currentSong = document.createElement("div");
	
	 currentSong.setAttribute("id", "CurrentSong");	
	currentSong.setAttribute('border-bottom', '1px solid black');
	 currentSong.innerHTML ="<img src='soundmanager/play.png' class='playButton' id='playButtonCurrent' onclick='play()'/><img src='soundmanager/prev.png' class='prevButton' onclick='playPrev()'/><img src='soundmanager/next.png' class='nextButton' onclick='playNext()'/><div class='song'><div id='ProgressBar' ><div id='songProgress' class='progess_front_line' ></div></div><div class='songTitle' id='songTitle'>"+songList[current.pos].title+"</div></div><div id='songDuration' class='duration'>"+getDuration(songList[current.pos].duration)+"</div><div id='soundControl'><div id='soundBar'><div id='volumeLine' class='progess_front_line'></div></div></div><img src='soundmanager/shuffle.png' class='prevButton' id='randomizeButton' onclick='randomizePlay()'/>";
	
	playList = document.createElement("div");
	playList.setAttribute("id", "playList");
	playList.setAttribute("onscroll", "loadMoreSongs(event)");
	playList.style.display = 'block';
	var songTextList = '';
	if(songList.length < 20){
	songsLoaded = songList.length;
	}else{
	songsLoaded = 20;
	}
	for(var i = 0; i < songsLoaded;i++){
		songTextList = songTextList+"<div id='"+songList[i].aid+"' class='playListSong'><img src='soundmanager/play.png' class='playButton' onclick='playThis("+songList[i].aid+","+i+")'/><div class='song'><div class='songTitle' >"+songList[i].title+"</div></div><div class='duration'>"+getDuration(songList[i].duration)+"</div></div><a href='"+songList[i].url+"'>dl</a>";
	
		}
	playList.innerHTML = songTextList;	
	audioPlayer = document.getElementById("AudioPlayer");	
	var clearElement = document.createElement("div");
	clearElement.style.clear = 'both';
		audioPlayer.appendChild(currentSong);
		audioPlayer.appendChild(clearElement);
		audioPlayer.appendChild(playList);
		songProgressLine = document.getElementById("songProgress");
		songProgressBar = document.getElementById("ProgressBar");
		songDuration = document.getElementById("songDuration");
		volumeLine = document.getElementById("volumeLine");
	    volumeBar = document.getElementById("soundBar");
		currentTitle = document.getElementById("songTitle");
		
		volumeLine.style.width = volume+"%";
			$("#ProgressBar").click(function(e){
				setPosition(e);
			});
			$("#soundBar").click(function(e){
				SetVolumeBar(e);
			});
			$("#dragElement").mousedown(function(e){
				$( "#AudioPlayer" ).draggable();
				$( "#AudioPlayer" ).draggable("enable");
				$( "#AudioPlayer" ).draggable({ appendTo: "body" });
			});
			$("#dragElement").mouseup(function(e){
				$( "#AudioPlayer" ).draggable("disable");
			});
		//abc.style.visibility ='visible';
	}
	var getDuration= function(duration){
		var durationMinStr = '';
		var durationSecStr = '';	
		var durationMin = 0;
		var durationSek = duration;
		
		durationMin = (durationSek - durationSek%60)/60;
		durationSek = durationSek%60;
			
		if(durationSek < 10){
			durationSecStr = '0'+durationSek;
		}else{
			durationSecStr = durationSek.toString();
		}
		if(durationMin < 10){
			durationMinStr = '0'+durationMin;
		}else{
			durationMinStr = durationMin.toString();
		}
		return durationMinStr+":"+durationSecStr
	
	}
	var updateSongProgress = function(){	
		var width = (this.position/(songList[current.pos].duration*1000))*100;
		//songProgressLine.setAttribute("style","width: "+width+"%; background-color: yellow;");
		//console.debug(songProgressLine);
		songProgressLine.style.width = width+"%";
		var duration = ((songList[current.pos].duration*1000)-this.position)/1000;
		songDuration.innerHTML = getDuration(Math.round(duration));
	}
	


	var setPosition = function(event){
		console.debug(event);
		var  x=event.clientX - event.target.offsetLeft - event.target.offsetParent.offsetLeft;
		console.debug()
		var progress = x/300;
		console.debug(current.pos);
		s = soundManager.getSoundById(songList[current.pos].aid.toString());
		s.setPosition(s.duration*progress);
		var duration = (s.duration-s.position)/1000;
		songDuration.innerHTML = getDuration(Math.round(duration));
		
		var width = (this.position/this.duration)*100;
		//songProgressLine.setAttribute("style","width: "+width+"%; background-color: yellow;");
		//console.debug(songProgressLine);
		songProgressLine.style.width = width+"%";
	}
		var SetVolumeBar = function(event){
		var  x=event.clientX - event.target.offsetLeft - event.target.offsetParent.offsetLeft;
		SetVolume(x*2);
		//songProgressLine.setAttribute("style","width: "+width+"%; background-color: yellow;");
		//console.debug(songProgressLine);
		
	}
	var SetVolume = function(p_volume){
				volume = p_volume
				setCookie("volume",volume,10);
				try{
				soundManager.setVolume(songList[current.pos].aid,volume);
				volumeLine.style.width = volume+"%";
				}catch(e){
					
				}
	}
	var playThis = function(aid,pos){
		soundManager.stopAll();
		current.pos = pos;
		
		var s = soundManager.getSoundById(aid.toString());
	
		if(s = 'undefined'){
			
			s = soundManager.createSound({
					id: songList[current.pos].aid.toString(),			
					url: songList[current.pos].url,
					autoLoad: true
					});
		}
		currentTitle.innerHTML = songList[current.pos].title;
		songDuration.innerHTML = getDuration(songList[current.pos].duration) 
		songProgressLine.style.width = "0%";
		playButtonCurrent.src='soundmanager/pause.png';
		s.setVolume(volume);
		soundManager.play(songList[current.pos].aid.toString(),{"onfinish":playNext,"whileplaying":updateSongProgress});
		
	}
var	loadMoreSongs = function(event){
	console.debug(event);
	console.debug(playList.scrollHeight);
	console.debug(playList.clientHeight);
	console.debug(playList.scrollHeight - playList.clientHeight);
	console.debug(playList.scrollTop);
	var proc = Math.round((playList.scrollTop/(playList.scrollHeight - playList.clientHeight))*100)
	if(proc > 70){
	if(songsLoaded < songList.length){
		if((songList.length - songsLoaded) > 10){
			
			for(var i = 0; i < 10; i ++){
				
				var playListSong = document.createElement("div");
				playListSong.setAttribute("class", "playListSong");
				playListSong.setAttribute("id",songList[songsLoaded].aid );
				playListSong.innerHTML="<img src='soundmanager/play.png' class='playButton' onclick='playThis("+songList[songsLoaded].aid+","+songsLoaded+")'/><div class='song'><div class='songTitle' >"+songList[songsLoaded].title+"</div></div><div class='duration'>"+getDuration(songList[songsLoaded].duration)+"</div>";
				playList.appendChild(playListSong);
				songsLoaded++;
			}
			
		}else{
		var countLeft = songList.length - songsLoaded;
			for(var i = 0; i < countLeft; i ++){
			var playListSong = document.createElement("div");
				playListSong.setAttribute("class", "playListSong");
				playListSong.setAttribute("id",songList[songsLoaded].aid );
				playListSong.innerHTML="<img src='soundmanager/play.png' class='playButton' onclick='playThis("+songList[songsLoaded].aid+","+songsLoaded+")'/><div class='song'><div class='songTitle' >"+songList[songsLoaded].title+"</div></div><div class='duration'>"+getDuration(songList[songsLoaded].duration)+"</div>";
				playList.appendChild(playListSong);
				songsLoaded++;
			
			}
			
			
		}
	}
	}
}
 
      //destroy the object when we are done
      function _stop()
      {
        document.onmousemove = null;
        document.onmouseup = null;
		document.onselectstart = null;
		document.body.style.cursor = 'auto';
      }
 
      //main functions which is responsible for moving the element (div in our example)
 $(function() {
        
    });
playlistShow = function(){
	if(playList.style.display == 'none'){
		playList.style.display = 'block';
	}else{
		playList.style.display = 'none';
	}
	}
var	randomizePlay = function(){
	if(randomize){
	randomize = false;
	document.getElementById('randomizeButton').style.opacity = 0.4;
	}else{
	randomize = true;
	document.getElementById('randomizeButton').style.opacity = 1;
	}
}
var getPosition = function(pos){
	if(randomize){
	return Math.floor(Math.random()*(songList.length-1))
	}else{
	return pos;
	}
	
	

}