package com.seanmiller.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.seanmiller.entity.PotentialRetailer;

@Repository
public interface RetailerRepository extends JpaRepository<PotentialRetailer, Long> {
	PotentialRetailer findByName(String name);
}
