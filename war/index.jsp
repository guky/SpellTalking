<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<!-- The HTML 4.01 Transitional DOCTYPE declaration-->
<!-- above set at the top of the file will set     -->
<!-- the browser's rendering engine into           -->
<!-- "Quirks Mode". Replacing this declaration     -->
<!-- with a "Standards Mode" doctype is supported, -->
<!-- but may lead to some differences in layout.   -->
<%@ page import ="com.google.appengine.api.users.User,com.google.appengine.api.users.UserService,com.google.appengine.api.users.UserServiceFactory" %>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title>Hello App Engine</title>
    <script src='/_ah/channel/jsapi'></script>
    <script language="javascript" src='AjaxUtil.js'></script>
	<script language="javascript" src='jquery-1.8.2.min.js'></script>
	<!--[if (!IE)]><!-->
	<link type="text/css" rel="stylesheet" href="style.css" />
	<!--<![endif]-->
	<script language="javascript" type="text/javascript" src="tiny_mce/tiny_mce.js"></script>

	
  </head>

  <body>

    
       
      	
        <div id ='FriendList'><div></div></div>
        <div id = "messageCont"><div></div>
            <h1>Hello App Engine!</h1>
<% UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();
		String navBar;
		String tzForm;
		if (user == null) {
			navBar = "<p>Welcome! <a href=\"" + userService.createLoginURL("/")
					+ "\">Sign in or register</a> to customize.</p>";
		
		} else {
			navBar = "<p>Welcome, <div id='userid'>" + user.getEmail() + "</div>! You can <a href=\""
					+ userService.createLogoutURL("/") + "\">sign out</a>.</p>";
		
		out.println(navBar);
		%>	
        </div>
      
      
       <div style="font-weight:bold;"><textarea id='messageBox' onkeydown="if(event.keyCode == 13){sendMessage()}"></textarea></div>
      
    
    <%} %>
  </body>
</html>
