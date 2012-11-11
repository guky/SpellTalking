package spelltalking;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.SimpleTimeZone;

import javax.servlet.ServletException;
import javax.servlet.http.*;



import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class SpellTalkingServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		req.setAttribute("name", "value");
		try {
			req.getRequestDispatcher("index.jsp").forward(req, resp);
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		resp.setContentType("text/html");
		//PrintWriter out = resp.getWriter();
		//out.println(navBar);
		//out.println("<p>The time is: " + fmt.format(new Date()) + "</p>");
		//out.println(tzForm);
	}
}
