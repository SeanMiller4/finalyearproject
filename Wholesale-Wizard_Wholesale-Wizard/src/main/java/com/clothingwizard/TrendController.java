package com.clothingwizard;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/recommendations")
public class TrendController {
	
	//private final String PYTHON_API_BASE = "http://localhost:5000";
	
	private final Map<String, String> flaskServers = new HashMap<>();

    @GetMapping("/hello")
    public String hello() {
        return "Hello World";
    }

    @GetMapping("/generate")
    public List<String> generateRecommendations() {
        List<String> responseList = new ArrayList<>();

        try {
            ProcessBuilder pb = new ProcessBuilder("python", "C:/Users/Admin/Wholesale-Wizard/Wholesale-Wizard/python-scripts/clothingTrends.py");
            Process process = pb.start();
            
            boolean finished = process.waitFor(30, TimeUnit.SECONDS);
            if (!finished) {
                process.destroy();
                responseList.add("Error: Python script timed out");
                return responseList; 
            }

            int exitCode = process.waitFor();
            System.out.println("Python script exited with code: " + exitCode);  

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.trim().isEmpty()) {
                    responseList.add(line.trim());
                }
            }

        } catch (Exception e) {
            responseList.add("Error generating recommendations: " + e.getMessage());
        }

        return responseList;  
    }
    
    @GetMapping("/predict")
    public ResponseEntity<String> getOverallPredictions() {
        return fetchFromPythonApi("/predict");
    }

    @GetMapping("/predict/clothing")
    public ResponseEntity<String> getClothingPredictions() {
        return fetchFromPythonApi("/predict/clothing");
    }
    
    @GetMapping("/predict/accessories")
    public ResponseEntity<String> getAccessoriesPredictions() {
        return fetchFromPythonApi("/predict/accessories");
    }
    
    @GetMapping("/predict/subcategory/{subcategory}")
    public ResponseEntity<String> getSubcategoryPredictions(@PathVariable String subcategory) {
        return fetchFromPythonApi("/predict/subcategory/" + subcategory);
    }
    
    @GetMapping("/trends")
    public ResponseEntity<List> getTrends() {
        return fetchListFromPythonApi("/trends");
    }
    
    @GetMapping("/data")
    public ResponseEntity<String> getData() {
        return fetchFromPythonApi("/data");
    }
    
    @GetMapping("/products")
    public ResponseEntity<List> getProducts() {
    	return fetchListFromPythonApi("/products");
    }
    
    @GetMapping("/retailers")
    public ResponseEntity<List> getRetailers() {
    	return fetchListFromPythonApi("/retailers");
    }
    
    private ResponseEntity<String> fetchFromPythonApi(String endpoint) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(PYTHON_API_BASE + endpoint, String.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching data: " + e.getMessage());
        }
    }
    
    private ResponseEntity<List> fetchListFromPythonApi(String endpoint) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            List response = restTemplate.getForObject(PYTHON_API_BASE + endpoint, List.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
