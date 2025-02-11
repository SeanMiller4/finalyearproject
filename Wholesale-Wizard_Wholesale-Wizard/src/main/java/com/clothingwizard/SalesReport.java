package com.clothingwizard;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class SalesReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String wholesaler;
    private Double salesAmount;
    private String timePeriod;
    private String topSellingProducts;
    private String category;
    
	public String getWholesaler() {
		return wholesaler;
	}
	public void setWholesaler(String wholesaler) {
		this.wholesaler = wholesaler;
	}
	public Double getSalesAmount() {
		return salesAmount;
	}
	public void setSalesAmount(Double salesAmount) {
		this.salesAmount = salesAmount;
	}
	public String getTimePeriod() {
		return timePeriod;
	}
	public void setTimePeriod(String timePeriod) {
		this.timePeriod = timePeriod;
	}
	public String getTopSellingProducts() {
		return topSellingProducts;
	}
	public void setTopSellingProducts(String topSellingProducts) {
		this.topSellingProducts = topSellingProducts;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}

}
