package spelltalking;

import java.util.Date;

public class ChatUser {
	private String Email;
	private String Token;
	private Date TokenDate;
	public String getEmail() {
		return Email;
	}
	public void setEmail(String email) {
		Email = email;
	}
	public String getToken() {
		return Token;
	}
	public void setToken(String token) {
		Token = token;
	}
	public Date getTokenDate() {
		return TokenDate;
	}
	public void setTokenDate(Date tokenDate) {
		TokenDate = tokenDate;
	}
	
}
