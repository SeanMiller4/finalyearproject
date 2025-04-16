package com.wholesalewizard.Wholesale_Wizard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

	@Autowired
	private UserService us;

	@Autowired
	private UserRepository ur;

	@GetMapping("/hello")
	public String hello() {
		return "Hello World!!!";
	}

	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody User user) {
		if (!ur.existsByUsername(user.getUsername())) {
			User registeredUser = us.registerUser(user.getUsername(), user.getPassword(), user.getProductCategory());
			return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
	}

	@PostMapping("/login")
	public ResponseEntity<User> loginUser(@RequestBody User user) {
		if (us.validateUser(user.getUsername(), user.getPassword())) {
			User foundUser = ur.findByUsername(user.getUsername());
			return new ResponseEntity<>(foundUser, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
