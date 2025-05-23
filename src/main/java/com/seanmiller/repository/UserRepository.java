
package com.seanmiller.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.seanmiller.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
        
    boolean existsByUsername(String username);
    
    boolean existsByUsernameAndPassword(String username, String password);
    
}      