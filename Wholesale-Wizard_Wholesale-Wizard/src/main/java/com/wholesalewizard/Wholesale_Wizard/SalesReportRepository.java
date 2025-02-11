package com.wholesalewizard.Wholesale_Wizard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.clothingwizard.SalesReport;
//import com.toyswizard.SalesReport;

@Repository
public interface SalesReportRepository extends JpaRepository<SalesReport, Long> {
    List<SalesReport> findByCategory(String category);
}
