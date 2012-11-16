package spelltalking;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.SimpleTimeZone;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import entities.ChatUser;

import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelPresence;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;




@SuppressWarnings("serial")
public class ConnectionHandlerServelet extends HttpServlet {

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		SimpleDateFormat fromat = new SimpleDateFormat("dd.MM - HH:mm:ss Z");
		fromat.setTimeZone(new SimpleTimeZone(2 * 60 * 60 * 1000, ""));
		ChannelService channelService = ChannelServiceFactory
				.getChannelService();
		ChannelPresence presence = channelService.parsePresence(request);
		String user = presence.clientId();		
		List<ChatUser> friendList = ChatUser.getConnectedUsers();
		ChatUser chatUser = ChatUser.getUserbyEmail(user);
		if (presence.isConnected()) {
			System.out.println("Client has connected: " + user);
			if(chatUser !=null){
			chatUser.setConnected(true);
			chatUser.save();
			}
			for (ChatUser friend : friendList) {
				
				System.out.println("Debug: user  " + friend.getEmail());
				if (!friend.getEmail().equals(user) && friend.isConnected()) {
					channelService.sendMessage(new ChannelMessage(friend
							.getEmail(), "<data>"
							+ "<type>addToFriendList</type>" + "<message>"
							+ user + "</message>" + "<from>Server</from>"
							+"<date>"+fromat.format(new Date())+"</date>"
							+ "</data>"));
				}
			}
		} else {
			System.out.println("Client has disconnected: " + user);
			if (chatUser != null) {
				chatUser.setConnected(false);
				chatUser.save();				
			}
			for (ChatUser friend : friendList) {
				
				System.out.println("Debug: user  " + friend.getEmail());
				if (!friend.getEmail().equals(user) && friend.isConnected()) {
					channelService.sendMessage(new ChannelMessage(friend
							.getEmail(), "<data>"
							+ "<type>removeFromFriendList</type>" + "<message>"
							+ user + "</message>" + "<from>Server</from>"
							+ "<date>"+fromat.format(new Date())+"</date>" +"</data>"));
				}
			}
		}

	}
}
