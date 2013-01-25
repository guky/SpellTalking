package spelltalking;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class VkAudioServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		req.setAttribute("name", "value");
		try {
			req.getRequestDispatcher("soundmanager/vk_api.jsp").forward(req, resp);
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
