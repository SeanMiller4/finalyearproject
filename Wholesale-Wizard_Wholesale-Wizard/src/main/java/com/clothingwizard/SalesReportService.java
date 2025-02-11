package com.clothingwizard;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wholesalewizard.Wholesale_Wizard.SalesReportRepository;

@Service
public class SalesReportService {

    @Autowired
    private SalesReportRepository salesReportRepository;

    public List<SalesReport> getClothingSalesReports() {
        return salesReportRepository.findByCategory("Clothing");
    }
}
