commandParser = function(command){
	
	var cmd = command.substring(1);
	cmd = cmd.split(" ");	
	if(cmd.length == 3){
		
	switch(cmd[0]){
	case 'set':
		switch(cmd[1]){
		case 'nick': 
			var regexp = /\W+/;		
			//alert(cmd[2].replace(regexp,'E'));
			
			if(cmd[2].search(regexp) == -1){
				setNickName(cmd[2]);
			}else{ 
				addSystemMessage("Unsuported chars in nick name(only letters and numbers)",dateFormat());
			}
			break;
		case 'color': 
			var regexp = /^#[A-F0-9]{6}/;		
			//alert(cmd[2].replace(regexp,'E'));
			//alert(cmd[2].search(regexp));
			if(cmd[2].search(regexp) == 0){
				//alert(cmd[2])
				setColorName(cmd[2].substring(1));
			}else{ 
				addSystemMessage("Invalid color",dateFormat());
			}
			break;	
		default: addSystemMessage("Unknow argument: "+cmd[1],dateFormat()); break;	
		}
		break;	
	default:addSystemMessage("Unknow command: "+cmd[0],dateFormat());	break;
	}
	}else{
		addSystemMessage("Wrong command format missing arguments",dateFormat());
	}
};
setNickName = function(nickName){
	var settings = '/settings?action=1&nick='+nickName;
	$.ajax({
		  type: "POST",
		  url: settings,
		  //data: { name: "John", location: "Boston" 
			
		}).done(function( msg ) {
			addSystemMessage(msg,dateFormat());		 
		});
}
setColorName = function(color){
	var settings = '/settings?action=2&color='+color;
	$.ajax({
		  type: "POST",
		  url: settings,
		  //data: { name: "John", location: "Boston" 
			
		}).done(function( msg ) {
			addSystemMessage(msg,dateFormat());		 
		});
}

