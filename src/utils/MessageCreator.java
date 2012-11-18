package utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.SimpleTimeZone;

public class MessageCreator {
	public static String CreateServerMessage(String user,String nick,String type,String color){
		SimpleDateFormat fromat = new SimpleDateFormat("dd.MM - HH:mm:ss");
		fromat.setTimeZone(new SimpleTimeZone(2 * 60 * 60 * 1000, ""));
		String  Message = "<data>"
				+ "<type>"+type+"</type>" + "<message>"
				+ user + "</message>" + "<from>Server</from>"
				+"<date>"+fromat.format(new Date())+"</date>"
				+"<nick>"+nick+"</nick>"
				+"<color>"+color+"</color>"
				+ "</data>";
		return Message;
		
	}
	public static String CreateServerMessage(String user,String nick,String type){
		SimpleDateFormat fromat = new SimpleDateFormat("dd.MM - HH:mm:ss");
		fromat.setTimeZone(new SimpleTimeZone(2 * 60 * 60 * 1000, ""));
		String  Message = "<data>"
				+ "<type>"+type+"</type>" + "<message>"
				+ user + "</message>" + "<from>Server</from>"
				+"<date>"+fromat.format(new Date())+"</date>"
				+"<nick>"+nick+"</nick>"			
				+ "</data>";
		return Message;
		
	}
	public static String CreateNickChangeMessage(String user,String nick,String color){
		SimpleDateFormat fromat = new SimpleDateFormat("dd.MM - HH:mm:ss");
		fromat.setTimeZone(new SimpleTimeZone(2 * 60 * 60 * 1000, ""));
		String  Message = "<data>"
				+ "<type>nickNameChange</type>" + "<message>"
				+ nick + "</message>" + "<from>"+user+"</from>"
				+"<date>"+fromat.format(new Date())+"</date>"
				+"<color>"+color+"</color>"
				+ "</data>";
		System.out.println(Message);
		return Message;
		
	}
	public static String CreateColorChangeMessage(String user,String color){
		SimpleDateFormat fromat = new SimpleDateFormat("dd.MM - HH:mm:ss");
		fromat.setTimeZone(new SimpleTimeZone(2 * 60 * 60 * 1000, ""));
		String  Message = "<data>"
				+ "<type>colorChange</type>" + "<message>"
				+ color + "</message>" + "<from>"+user+"</from>"
				+"<date>"+fromat.format(new Date())+"</date>"
				+ "</data>";
		System.out.println(Message);
		return Message;
		
	}
}
