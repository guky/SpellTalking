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
					id: current.pos.toString(),			
					url: r.response[0].url,
					autoLoad: true
					});
					soundManager.play(current.pos.toString(),{onfinish:playNext});
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
			 s = soundManager.getSoundById('0');
			if(s == null){
			s = soundManager.createSound({
					id: current.pos.toString(),			
					url: songList[0].url,
					autoLoad: true
					});
			}		
    			current.pos = 0;
    			console.debug("pos:"+current.pos); 
						
    		}else{
    			current.pos = current.pos+1;
    			console.debug("pos:"+current.pos);
				 s = soundManager.getSoundById(current.pos);
    		if(s == null){
			s = soundManager.createSound({
					id: current.pos.toString(),			
					url: songList[current.pos].url,
					autoLoad: true
			});
			}	
			
    		}
    		s.setVolume(volume);
			soundManager.play(current.pos.toString(),{onfinish:playNext});
        	 
        }
    	
    	function playPrev() {
		var s;
    		soundManager.stopAll();
    		if(current.pos == 0){
    			current.pos = songList.length-1;
    			console.debug("pos:"+current.pos);   
    			s = soundManager.getSoundById(current.pos.toString());
				if(s == null){
					s = soundManager.createSound({
					id: current.pos.toString(),			
					url: songList[current.pos].url,
					autoLoad: true
					});
			}	
    			
    		}else{
    			current.pos = current.pos-1;
    			s = soundManager.getSoundById(current.pos.toString());
				if(s == null){
					s = soundManager.createSound({
					id: current.pos.toString(),			
					url: songList[current.pos].url,
					autoLoad: true
					});
    			}
    		}
			s.setVolume(volume);
			soundManager.play(current.pos.toString(),{onfinish:playNext});
      }
       	function play() {
        	  soundManager.togglePause(current.pos.toString());
        	  
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
    	