
package com.wholesalewizard.Wholesale_Wizard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

	@Autowired
	private UserRepository ur;
	
	private static final String DOMAIN = "@irishagencies.com";
	
	public User registerUser(String username, String password, String productCategory) {
		User user = new User();
		user.setUsername(username);
		user.setPassword(password);
		user.setProductCategory(productCategory);
		user.setEmail(username + DOMAIN);
		return ur.save(user);
	}
	
	public boolean validateUser(String username, String password) { 
	  User user = ur.findByUsername(username);
	  if(user != null && password != null) {
		  return true;
	  }
	  return false;
	}
}

