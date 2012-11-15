package entities;


import java.util.Date;
import java.util.List;


import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityManager;
import javax.persistence.Id;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

import org.datanucleus.api.jpa.annotations.Extension;






import com.google.appengine.api.datastore.Text;


import utils.EMF;



@Entity(name = "ChatMessage")
public class ChatMessage {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Extension(vendorName = "datanucleus",
	key = "gae.encoded-pk",
	value = "true")
	private String id;	
	@Basic
	private String Email;
	private String Color;
	private Date MessageDate;	
	private Text messageText;	
	
	public String getColor() {
		return Color;
	}
	public void setColor(String color) {
		Color = color;
	}
	public String getEmail() {
		return Email;
	}
	public void setEmail(String email) {
		Email = email;
	}
	public Date getMessageDate() {
		return MessageDate;
	}
	public void setMessageDate(Date messageDate) {
		MessageDate = messageDate;
	}
	public Text getMessageText() {
		return messageText;
	}
	public void setMessageText(Text messageText) {
		this.messageText = messageText;
	}
	public void save() {
		EntityManager em = EMF.get().createEntityManager();
		System.out.println("About to save chat msg");
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
	public static List<ChatMessage> getMessadges() {	
		EntityManager em = EMF.get().createEntityManager();
		javax.persistence.Query query = em.createQuery("SELECT m FROM ChatMessage m ORDER BY MessageDate DESC");
		query.setMaxResults(100);
		try{
		
		List<ChatMessage> results = (List<ChatMessage>) query.getResultList();
		System.out.println("result size:" + results.size());
		 return results;
		} finally {
			em.close();
		}
	}



}
