/**
 * Copyright 2011 Google
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package spelltalking;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import entities.ChatUser;
import entities.FriendStore;

/**
 * FriendServlet  adds the new logged in user if the user is not logged in already
 * Gives the list of users online 
 * The response is sent as an XML to enable
 * For each user the message that a new user logged is sent through the channel API
 * 
 * @author 
 *
 */
@SuppressWarnings("serial")
public class FriendServlet extends HttpServlet {
	/**
	 * ChannelService object to update all clients about the new logged in user
	 */
  private static ChannelService channelService = ChannelServiceFactory.getChannelService();
	
	/**
   * Logger to log all the updates and warnings
   */
  private static final Logger logger = Logger.getLogger(FriendServlet.class.getCanonicalName());
	
	/**
	 * Accepts the userid from the user and updates it 
	 */
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
  throws ServletException, IOException {
	  UserService userService = UserServiceFactory.getUserService();
		User userAcc = userService.getCurrentUser();
	  
	   
  	String user = userAcc.getEmail();
  	//ChatUser cUser = new ChatUser();
  	response.setContentType("text/xml");
  	String outputTxt =	"<data>\n" ;
  	FriendStore friendStore = FriendStore.getInstance();
  	

  	
   
    logger.log(Level.INFO,"All the users list is written to the output and "+"the message about new user sent to all other users");
    HashMap<String,ChatUser>friendList = friendStore.getFriends();
    Set<String>friendNames = friendList.keySet();
  	//Add all the users logged in already to the new user friends list
    // and also update all of them about the new user
  
    for (String name : friendNames){
    	ChatUser friend = friendList.get(name);
    	  System.out.println("Debug: user  "+name);
      if(!friend.getEmail().equals(user) && friend.isConnected()){
        outputTxt +="<friend><name>" + friend.getEmail() +"</name></friend>\n";
        channelService.sendMessage(
  		  new ChannelMessage(friend.getEmail(),"<data>" +
  			"<type>addToFriendList</type>" +
  			"<message>"+user+"</message>" +
  			"<from>Server</from>" +	"</data>"));
  	  }
    }
    outputTxt += "</data>\n";
    response.getWriter().print(outputTxt);
  }
  
}