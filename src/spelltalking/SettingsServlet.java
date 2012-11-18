package spelltalking;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import utils.MessageCreator;

import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import entities.ChatUser;

@SuppressWarnings("serial")
public class SettingsServlet extends HttpServlet {
	
	private static ChannelService channelService = ChannelServiceFactory.getChannelService();
	
	  protected void doPost(HttpServletRequest request, HttpServletResponse response)
			  throws ServletException, IOException {
		  int action = new Integer(request.getParameter("action")).intValue();
		  String responseText = "";;
		  UserService userService = UserServiceFactory.getUserService();
		  User userAcc = userService.getCurrentUser();
		  ChatUser chatUser = ChatUser.getUserbyEmail(userAcc.getEmail());
		  switch(action){
		  case 1: 
			String nick = request.getParameter("nick");
			if(nick != null && !nick.equals("") && !ChatUser.isNickNameUsed(nick)){
		  	if(chatUser !=null){
		  		chatUser.setNickName(request.getParameter("nick"));
		  		chatUser.save();
		  		responseText ="nickNameUpdated";
		  		ReplaceToNickName(chatUser);
		  	}
		  	}else{
		  		responseText ="alreadyInUse";		  		
		  	}
		  	break;
		  case 2: 
			  String color = request.getParameter("color");
				if(color != null && !color.equals("") && !ChatUser.isColorUsed(color)){
			  	if(chatUser !=null){
			  		chatUser.setColor("#"+color);
			  		chatUser.save();
			  		responseText ="colorUpdated";
			  		ReplaceToNickColor(chatUser);
			  	}
			  	}else{
			  		responseText ="alreadyInUse";
			  	}
			  break;		  
		  default: 
			  responseText ="Unknow action";		
			  break;		    
		  }
		  response.getWriter().print(responseText);
	  }
	  private void ReplaceToNickName(ChatUser chatUser){
		  System.out.println("Sending nick update info");
		  List<ChatUser> friendList = ChatUser.getConnectedUsers();
			for (ChatUser friend : friendList) {
				if (!friend.getEmail().equals(chatUser.getEmail()) && friend.isConnected()) {
					channelService.sendMessage(new ChannelMessage(friend
							.getEmail(), MessageCreator.CreateNickChangeMessage(chatUser.getEmail(), chatUser.getNickName(),chatUser.getColor())));
				}
			}
	  }
	  private void ReplaceToNickColor(ChatUser chatUser){
		  System.out.println("Sending nick update info");
		  List<ChatUser> friendList = ChatUser.getConnectedUsers();
			for (ChatUser friend : friendList) {
				if (!friend.getEmail().equals(chatUser.getEmail()) && friend.isConnected()) {
					channelService.sendMessage(new ChannelMessage(friend
							.getEmail(), MessageCreator.CreateColorChangeMessage(chatUser.getEmail(), chatUser.getColor())));
				}
			}
	  }
}
