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
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.SimpleTimeZone;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.appengine.api.channel.ChannelFailureException;
import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import entities.ChatMessage;
import entities.ChatUser;


/**
 * This servlet is responsible for sending messages across the channel.
 * 
 * @author
 */
@SuppressWarnings("serial")
public class MessageServlet extends HttpServlet {
  
  private static final Logger logger = Logger.getLogger(MessageServlet.class.getCanonicalName());
  
  private static ChannelService channelService = ChannelServiceFactory.getChannelService();

  /**
   * Check the incoming parameters and create the channel message . 
   * Send "OFFLINE" reply in case of an exception such as the user channel do not exist
   */
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
  throws ServletException, IOException {
	 SimpleDateFormat fromat = new SimpleDateFormat("dd.MM - HH:mm:ss Z");
	 fromat.setTimeZone(new SimpleTimeZone(2 * 60 * 60 * 1000, ""));
	int action = new Integer(request.getParameter("action")).intValue();
	switch(action){
	case 1:UserService userService = UserServiceFactory.getUserService();
	User userAcc = userService.getCurrentUser();		    
    String message = request.getParameter("message");
    System.out.println("message got"+message);
   // String users[] = request.getParameter("to").split(":");
    String from = request.getParameter("from");
	ChatMessage	chatMessage = new ChatMessage();
  	chatMessage.setEmail(userAcc.getEmail());
  	chatMessage.setMessageText(new Text(message));
  	chatMessage.setMessageDate(new Date());
  	chatMessage.save();   
  	
    List<ChatUser> friendList = ChatUser.getConnectedUsers();
    for(ChatUser user : friendList){
    	
    if (user.getEmail() != null && !user.getEmail().equals("") && message != null
        && !message.equals("") && user.isConnected()) {
      try{
      	String outputMessage ="<data>" +
		  "<type>updateChatBox</type>" +
		  "<message>"+message+"</message>" +
		  "<from>"+from+"</from>" +
		  "<date>"+fromat.format(new Date())+"</date>" +
		  "</data>";       
        logger.log(Level.INFO,"sending message  into the channel");
        System.out.println("Sending message to "+user +" Message: " + outputMessage);
      	sendMessageToChannel(user.getEmail(), outputMessage);
      } catch (ChannelFailureException channelFailure) {
      	logger.log(Level.WARNING, "Failed in sending message to channel");
      	System.out.println("Sending message to "+user +"ChannelErrror");
        response.getWriter().print("OFFLINE");
      } catch (Exception e) {
        logger.log(Level.WARNING, "Unknow error while sending message to the channel");
    	System.out.println("Sending message to "+user +"Errror");
        response.getWriter().print("OFFLINE");
      }
    }
    }
    break;
	case 2:
	
	List<ChatMessage>chatMessageList = ChatMessage.getMessadges();
	String responseText = "<data>";
	for(ChatMessage cm : chatMessageList){
		responseText +="<message>" +
				  "<color>updateChatBox</color>" +
				  "<date>"+fromat.format(cm.getMessageDate())+"</date>" +
				  "<messageText>"+cm.getMessageText().getValue()+"</messageText>" +
				  "<from>"+cm.getEmail()+"</from>" +
				  "</message>";
		
	}
	responseText += "</data>";
	response.getWriter().print(responseText);
	break;
	}
  }

  /**
   * Creates the Channel Message and sends to the client  
   * @param user the user to whom the message is sent 
   * @param message the message that needs to pass 
   */
  public void sendMessageToChannel(String user,String message) throws ChannelFailureException{
  	channelService.sendMessage(new ChannelMessage(user, message));
  	
  }
}