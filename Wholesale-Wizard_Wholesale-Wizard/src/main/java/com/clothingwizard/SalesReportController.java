package com.clothingwizard;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports")
public class SalesReportController {
	    @Autowired
	    private SalesReportService salesReportService;

	    @GetMapping("/clothing")
	    public ResponseEntity<List<SalesReport>> getClothingSalesReports() {
	        List<SalesReport> reports = salesReportService.getClothingSalesReports();
	        return ResponseEntity.ok(reports);
	    }
	}
