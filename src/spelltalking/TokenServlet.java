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
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;



import com.google.appengine.api.channel.ChannelFailureException;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import entities.ChatUser;



/**
 * This servlet creates the channel with the server and gets the token.
 * 
 * @author
 */
@SuppressWarnings("serial")
public class TokenServlet extends HttpServlet {

  private static final Logger logger = Logger.getLogger(TokenServlet.class.getCanonicalName());

  private static ChannelService channelService = ChannelServiceFactory.getChannelService();

	/**
	 * Get the token for connecting & listening on the channel
	 */
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
	  throws ServletException, IOException {
	  UserService userService = UserServiceFactory.getUserService();
	String token = "";  
	User user = userService.getCurrentUser();	
	ChatUser chatUser = 
			ChatUser.getUserbyEmail(user.getEmail());	
    if (user != null && !"".equals(user.getEmail()) && chatUser == null) {
    	token = createChannel(user.getEmail());
    	chatUser = new ChatUser();
    	chatUser.setEmail(user.getEmail());
    	chatUser.setColor("#66CCCC");
    	chatUser.setToken(token);
    	chatUser.setTokenDate(new Date());    	
    	chatUser.save();
    	System.out.println("Token done for "+user+" New Token = " +token);
      writeIntoChannel(response,token);
    }else if(chatUser != null){   
    	System.out.println(chatUser.getTokenDate());
    	System.out.println(new Date());
    	System.out.println((new Date().getTime() - chatUser.getTokenDate().getTime())/(1000*60*60));
    	String forced = request.getParameter("forced");
    	if((((new Date().getTime() - chatUser.getTokenDate().getTime())/(1000*60*60)) > 22*60) || forced.equals("true")){
    		token = createChannel(user.getEmail());
    		chatUser.setToken(token);
    		chatUser.setTokenDate(new Date());
    		chatUser.save();
    		writeIntoChannel(response,token);
    		 System.out.println("Token done for "+user+" ReToken = " +token);
    	}else{    		
    		writeIntoChannel(response,chatUser.getToken());
    		 System.out.println("Token done for "+user+" Old Token = " +chatUser.getToken());
    	}
    }

  }

	/**
	 * Creates the Channel token for the user 
	 * @param userId The User whom the token is created for  
	 * @return The token string is returned
	 */
  public String createChannel(String userId){
    try{
      logger.log(Level.INFO, "Creating a channel for {0}",userId);
      System.out.println("creating the channel");
      return channelService.createChannel(userId,23*60);
    } catch(ChannelFailureException channelFailureException){
      logger.log(Level.WARNING, "Error creating the channel");
      System.out.println("Error creating the channel");
      return null;
    } catch(Exception otherException){
      logger.log(Level.WARNING, "Unknown exception while creating channel");
      System.out.println("Unknown exception while creating channel");
      return null;
    }
  }

	/**
	 * Writes the token in the response text 
	 * 
	 * @param response The response object to write the response text 
	 * @param token The token which needs to be written in the response
	 * @throws IOException
	 */
  public void writeIntoChannel(HttpServletResponse response, String token){
    try{
      logger.log(Level.INFO, "Writing the token {0} to the output",token);
      System.out.println("Writing the token {0} to the output");
      response.getWriter().print(token);
	} catch(IOException ioException){
      logger.log(Level.WARNING, "Exception while writing output ");
      System.out.println("Exception while writing output ");
      //ioException.printStackTrace();
    } catch(Exception exception){
      logger.log(Level.WARNING, "Unknow exception while writing output ");
      System.out.println("Unknow exception while writing output ");
     // exception.printStackTrace();
    }
  }
}
