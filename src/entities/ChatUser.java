package entities;

import java.util.Date;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;
import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityManager;
import javax.persistence.Id;

import utils.PMF;



import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.users.User;

@PersistenceCapable
public class ChatUser {
	 @PrimaryKey
	 @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	 private String Email;

	
	@Persistent
	private String Token;
	@Persistent
	private Date TokenDate;
	@Persistent
	private boolean Connected = false;
	
	public boolean isConnected() {		
		return Connected;		
	}
	public void setConnected(boolean connected) {		
		Connected = connected;	
	}
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
	public static void save(ChatUser chatUser) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
        try {
            pm.makePersistent(chatUser);
        } finally {
            pm.close();
        }

	}
	@SuppressWarnings("unchecked")
	public static List<ChatUser> getConnectedUsers() {	
		System.out.println("Save called");
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query q = pm.newQuery("select from ChatUser " +
                "where Connected == connectedParam " +
                "parameters boolean connectedParam");

		List<ChatUser> results;

		try {
		results = (List<ChatUser>) q.execute(true);
		System.out.println("Save done");
		 return results;
		} finally {
		  q.closeAll();
		}
	}
	
	public static ChatUser getUserbyEmail(String Email) {		
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query q = pm.newQuery("select from ChatUser " +
                "where Email == emailParam " +
                "parameters String emailParam");

		ChatUser results = null;

		try {
		results = (ChatUser) q.execute(Email);
		 return results;
		} finally {
		  q.closeAll();
		}
	}
	
}
