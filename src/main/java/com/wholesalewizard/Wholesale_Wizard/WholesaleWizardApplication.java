package com.wholesalewizard.Wholesale_Wizard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.wholesalewizard.Wholesale_Wizard", "com.clothingwizard"})
@EntityScan(basePackages = {"com.wholesalewizard.Wholesale_Wizard", "com.clothingwizard"})
public class WholesaleWizardApplication {

	public static void main(String[] args) {
		SpringApplication.run(WholesaleWizardApplication.class, args);
	}
}