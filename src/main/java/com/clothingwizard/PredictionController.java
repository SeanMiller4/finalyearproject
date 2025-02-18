package com.clothingwizard;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.*;

@RestController
@RequestMapping("/api")
public class PredictionController {
	
	 @GetMapping("/hello")
	    public String hello() {
	        return "Hello World";
	    }

    @GetMapping
    public String getOverallPredictions() {
        return callPythonScript("overall");
    }

    @GetMapping("/clothing")
    public String getClothingPredictions() {
        return callPythonScript("clothing");
    }

    @GetMapping("/accessories")
    public String getAccessoriesPredictions() {
        return callPythonScript("accessories");
    }

    @GetMapping("/subcategory/{subcategory}")
    public String getSubcategoryPredictions(@PathVariable String subcategory) {
        return callPythonScript(subcategory);
    }

    private String callPythonScript(String category) {
        String command = "python c:/users/admin/wholesale-wizard_wholesale-wizard/python-scripts/test.py " + category;
        try {
            Process process = Runtime.getRuntime().exec(command);

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            process.waitFor();

            return output.toString();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return "{\"error\":\"Failed to call Python script\"}";
        }
    } 
   

    @GetMapping("/getRetailers")
    public ResponseEntity<String> getRetailers(@RequestParam String city) {
        try {
            String command = "C:/users/admin/wholesale-wizard_wholesale-wizard/python-scripts/clothingRecommendation.py";
            
            ProcessBuilder processBuilder = new ProcessBuilder("python", command, city);
            processBuilder.redirectErrorStream(true);  
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            process.waitFor(); 
            
            return new ResponseEntity<>(output.toString(), HttpStatus.OK);

        } catch (IOException | InterruptedException e) {
            return new ResponseEntity<>("Error executing Python script: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}