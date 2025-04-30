package com.seanmiller.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.seanmiller.email.OrderService;
import com.seanmiller.entity.Order;
import com.seanmiller.entity.PotentialRetailer;
import com.seanmiller.repository.RetailerRepository;

import java.io.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PredictionController {

	@Autowired
	private RetailerRepository retailerRepository;

	@Autowired
	private OrderService orderService;

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

	@GetMapping("/subcategory/{subcategory}")
	public String getSubcategoryPredictions(@PathVariable String subcategory) {
		return callPythonScript(subcategory);
	}
	
	@GetMapping("/subcategories")
	public ResponseEntity<String> getSubcategories() {
		return callPythonScriptForSubcategories();
	}

	private String callPythonScript(String category) {
		String command = "python c:/users/admin/finalyearproject/python-scripts/forecastClothingTrends.py " + category;
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
	
	private ResponseEntity<String> callPythonScriptForSubcategories() {
		String command = "python c:/users/admin/finalyearproject/python-scripts/forecastClothingTrends.py subcategories";
		try {
			Process process = Runtime.getRuntime().exec(command);
			
		    BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
		    StringBuilder output = new StringBuilder();
		    String line;
		    while((line = reader.readLine()) != null) { 
			    output.append(line);
		    }
		
		    process.waitFor();
		
		    return ResponseEntity.ok(output.toString());
		
		} catch(IOException | InterruptedException e) {
			return new ResponseEntity<>("Error executing Python script: " + e.getMessage(),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getRetailers")
	public ResponseEntity<String> getRetailers(@RequestParam String product, @RequestParam String city) {
		try {
			String command = "C:/users/admin/finalyearproject/python-scripts/clothingRecommendation.py";

			ProcessBuilder processBuilder = new ProcessBuilder("python", command, product, city);
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
			return new ResponseEntity<>("Error executing Python script: " + e.getMessage(),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getTrendingProducts")
	public ResponseEntity<String> getTrendingProducts() {
		try {
			ProcessBuilder processBuilder = new ProcessBuilder("python",
					"c:/users/admin/finalyearproject/python-scripts/clothingRecommendation.py");
			processBuilder.redirectErrorStream(true);
			Process process = processBuilder.start();

			BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
			StringBuilder output = new StringBuilder();
			String line;

			while ((line = br.readLine()) != null) {
				output.append(line);
			}

			int exitCode = process.waitFor();
			if (exitCode == 0) {
				return ResponseEntity.ok(output.toString());
			} else {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error running Script");
			}

		} catch (IOException | InterruptedException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@PostMapping("/saveRetailer")
	public ResponseEntity<String> saveRetailer(@RequestBody PotentialRetailer retailer) {
		try {
			retailer.setEmail(retailer.getName().replaceAll("\\s+", "").toLowerCase() + "@retailer.ie");
			retailerRepository.save(retailer);
			return new ResponseEntity<>("{\"message\": \"Retailer saved successfully\"}", HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>("{\"error\":\"Failed to save retailer: " + e.getMessage() + "\"}",
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/savedRetailers")
	public ResponseEntity<List<PotentialRetailer>> getSavedRetailers() {
		List<PotentialRetailer> retailers = retailerRepository.findAll();
		return ResponseEntity.ok(retailers);
	}

	@PostMapping("/orders")
	public ResponseEntity<byte[]> createOrder(@RequestBody Order order) throws IOException {

		byte[] invoiceBytes = orderService.createOrder(order);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_PDF);
		headers.add("Content-Disposition", "inline; filename=invoice.pdf");

		return ResponseEntity.ok().headers(headers).body(invoiceBytes);
	}

	@GetMapping("/vogueTrending")
	public ResponseEntity<String> getVogueTrending() {
		try {
			ProcessBuilder processBuilder = new ProcessBuilder("python",
					"c:/users/admin/finalyearproject/python-scripts/clothingTrends.py");
			processBuilder.redirectErrorStream(true);
			Process process = processBuilder.start();

			BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
			StringBuilder output = new StringBuilder();
			String line;

			while ((line = br.readLine()) != null) {
				output.append(line);
			}

			int exitCode = process.waitFor();
			if (exitCode == 0) {
				return ResponseEntity.ok(output.toString());
			} else {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error running Script");
			}
		} catch (IOException | InterruptedException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
}