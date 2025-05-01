package com.seanmiller.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.seanmiller.entity.PotentialRetailer;

@Repository
public interface RetailerRepository extends JpaRepository<PotentialRetailer, Integer> {
	PotentialRetailer findByName(String name);
	
	List<PotentialRetailer> findByUserId(int userId);
}
