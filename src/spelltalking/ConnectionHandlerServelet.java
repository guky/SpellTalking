package spelltalking;

import java.io.IOException;
import java.util.HashMap;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelPresence;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;

@SuppressWarnings("serial")
public class ConnectionHandlerServelet extends HttpServlet {

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		ChannelService channelService = ChannelServiceFactory
				.getChannelService();
		ChannelPresence presence = channelService.parsePresence(request);
		String user = presence.clientId();
		HashMap<String, ChatUser> friendList = FriendStore.getInstance()
				.getFriends();
		Set<String> friendNames = friendList.keySet();
		if (presence.isConnected()) {
			System.out.println("Client has connected: " + user);
			if (friendList.containsKey(user)) {
				friendList.get(user).setConnected(true);

			}
			for (String name : friendNames) {
				ChatUser friend = friendList.get(name);
				System.out.println("Debug: user  " + name);
				if (!friend.getEmail().equals(user) && friend.isConnected()) {
					channelService.sendMessage(new ChannelMessage(friend
							.getEmail(), "<data>"
							+ "<type>addToFriendList</type>" + "<message>"
							+ user + "</message>" + "<from>Server</from>"
							+ "</data>"));
				}
			}
		} else {
			System.out.println("Client has disconnected: " + user);
			if (friendList.containsKey(user)) {
				friendList.get(user).setConnected(false);
				for (String name : friendNames) {
					ChatUser friend = friendList.get(name);
					System.out.println("Debug: user  " + name);
					if (!friend.getEmail().equals(user) && friend.isConnected()) {
						channelService.sendMessage(new ChannelMessage(friend
								.getEmail(), "<data>"
								+ "<type>removeFromFriendList</type>" + "<message>"
								+ user + "</message>" + "<from>Server</from>"
								+ "</data>"));
					}
				}
			}
		}

	}
}
