/*
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

*/

package com.clothingwizard;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/recommendations")
public class TrendController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello World";
    }

    @GetMapping("/generate")
    public ResponseEntity<List<String>> generateRecommendations() {
        return runPythonScript("C:/Users/Admin/Wholesale-Wizard/Wholesale-Wizard/python-scripts/clothingTrends.py");
    }

    @GetMapping("/predict")
    public ResponseEntity<List<String>> getOverallPredictions() {
        return runPythonScript("C:/Users/Admin/Wholesale-Wizard/Wholesale-Wizard/python-scripts/forecastTrends.py");
    }

    @GetMapping("/predict/clothing")
    public ResponseEntity<List<String>> getClothingPredictions() {
        return runPythonScript("C:/Users/Admin/Wholesale-Wizard/Wholesale-Wizard/python-scripts/clothingPredictions.py");
    }

    @GetMapping("/predict/accessories")
    public ResponseEntity<List<String>> getAccessoriesPredictions() {
        return runPythonScript("C:/Users/Admin/Wholesale-Wizard/Wholesale-Wizard/python-scripts/accessoriesPredictions.py");
    }

    @GetMapping("/predict/subcategory/{subcategory}")
    public ResponseEntity<List<String>> getSubcategoryPredictions(@PathVariable String subcategory) {
        // Pass the subcategory as an argument to the Python script
        return runPythonScript("C:/Users/Admin/Wholesale-Wizard/Wholesale-Wizard/python-scripts/subcategoryPredictions.py", subcategory);
    }

    @GetMapping("/trends")
    public ResponseEntity<List<String>> getTrends() {
        return runPythonScript("C:/Users/Admin/Wholesale-Wizard/Wholesale-Wizard/python-scripts/trends.py");
    }

    @GetMapping("/data")
    public ResponseEntity<List<String>> getData() {
        return runPythonScript("C:/Users/Admin/Wholesale-Wizard/Wholesale-Wizard/python-scripts/dataProcessing.py");
    }

    @GetMapping("/products")
    public ResponseEntity<List<String>> getProducts() {
        return runPythonScript("C:/Users/Admin/Wholesale-Wizard/Wholesale-Wizard/python-scripts/products.py");
    }

    @GetMapping("/retailers")
    public ResponseEntity<List<String>> getRetailers() {
        return runPythonScript("C:/Users/Admin/Wholesale-Wizard/Wholesale-Wizard/python-scripts/retailers.py");
    }

    private ResponseEntity<List<String>> runPythonScript(String scriptPath, String... args) {
        List<String> responseList = new ArrayList<>();

        try {
            // Build the command to execute the Python script
            List<String> command = new ArrayList<>();
            command.add("python");
            command.add(scriptPath);
            for (String arg : args) {
                command.add(arg);
            }

            // Start the process
            ProcessBuilder pb = new ProcessBuilder(command);
            Process process = pb.start();

            // Wait for the process to complete (with a timeout of 30 seconds)
            boolean finished = process.waitFor(30, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly(); // Forcefully terminate the process if it times out
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(List.of("Error: Python script timed out"));
            }

            // Read the output of the Python script
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (!line.trim().isEmpty()) {
                        responseList.add(line.trim());
                    }
                }
            }

            // Check the exit code of the Python script
            int exitCode = process.exitValue();
            if (exitCode != 0) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(List.of("Error: Python script exited with code " + exitCode));
            }

            return ResponseEntity.ok(responseList);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of("Error running Python script: " + e.getMessage()));
        }
    }
}