package spelltalking;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AwayHandlerServelet extends HttpServlet {
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
	System.out.println(request.getMethod());
	System.out.println(request.getParameter("from"));
	response.getWriter().print("response Post");
	}
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
	System.out.println(request.getMethod());
	System.out.println(request.getParameter("from"));
	response.getWriter().print("response GET");
	}
}

