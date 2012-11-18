package entities;

import java.util.Date;
import java.util.List;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityManager;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.List;
import javax.persistence.Query;

import org.datanucleus.api.jpa.annotations.Extension;

import utils.EMF;



@Entity(name = "ChatUser")
public class ChatUser {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Extension(vendorName = "datanucleus",
	key = "gae.encoded-pk",
	value = "true")
	private String id;	
	@Basic
	private String Email;
	private String Token;	
	private Date TokenDate;	
	private boolean Connected = false;
	private String nickName;
	private String color;
	private int room;
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
	public String getNickName() {
		return nickName;
	}
	public void setNickName(String nickName) {
		this.nickName = nickName;
	}
	public  void save() {
		System.out.println("trying to save"+this.getEmail());
		EntityManager em = EMF.get().createEntityManager();
		try {
			em.persist(this);
		}
		catch(EntityExistsException e){
			em.merge(this);
		}
		finally {
			em.close();
		}
	}
	@SuppressWarnings("unchecked")
	public static List<ChatUser> getConnectedUsers() {	
		EntityManager em = EMF.get().createEntityManager();
		Query query = em.createQuery("SELECT c FROM ChatUser c where Connected = true");
		
		try{
		
		List<ChatUser> results = (List<ChatUser>) query.getResultList();
		System.out.println("result size:" + results.size());
		 return results;
		} finally {
			em.close();
		}
	}
	
public static boolean isNickNameUsed(String NickName) {
		EntityManager em = EMF.get().createEntityManager();
		Query query = em.createQuery("SELECT c FROM ChatUser c where nickName = :nickNameParam");
		query.setParameter("nickNameParam", NickName);
		try{
		
		ChatUser results =  (ChatUser) query.getSingleResult();

		 return true;
		} catch(javax.persistence.NoResultException e){
			return false;
		}
		finally {
			em.close();
		}
			
		}	
public String getColor() {
	return color;
}
public void setColor(String color) {
	this.color = color;
}
public int getRoom() {
	return room;
}
public void setRoom(int room) {
	this.room = room;
}
public String getId() {
	return id;
}
public static boolean isColorUsed(String color) {
	EntityManager em = EMF.get().createEntityManager();
	Query query = em.createQuery("SELECT c FROM ChatUser c where color = :colorParam");
	query.setParameter("colorParam", color);
	try{
	
		ChatUser results =  (ChatUser) query.getSingleResult();	
	 return true;
	} catch(javax.persistence.NoResultException e){
		if(color.compareToIgnoreCase("#CC9900") == 0){
			return true;
		}
		return false;
	}
	finally {
		em.close();
	}
		
	}
public static ChatUser getUserbyEmail(String Email) {
	EntityManager em = EMF.get().createEntityManager();
	Query query = em.createQuery("SELECT c FROM ChatUser c where Email = :email_id");
	
	query.setParameter("email_id", Email);
	try{
	
	ChatUser results =  (ChatUser) query.getSingleResult();
	
	 return results;
	} catch(javax.persistence.NoResultException e){
		return null;
	}
	finally {
		em.close();
	}
		
	}


	
}
