package com.wholesalewizard.Wholesale_Wizard;

import org.springframework.boot.CommandLineRunner;

import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class PythonScripts implements CommandLineRunner {
	
	@Override
	public void run(String... args) throws Exception {
        runPythonScript();
	}

    public void runPythonScript() throws IOException {
    	
    	String[] pythonScripts = {
    			"c:/users/admin/wholesale-wizard_wholesale-wizard/python-scripts/clothingRecommendation.py",
    			"c:/users/admin/wholesale-wizard_wholesale-wizard/python-scripts/clothingTrends.py",
    			"c:/users/admin/wholesale-wizard_wholesale-wizard/python-scripts/forecastClothingTrends.py",

    	};
    	
    	for(String script: pythonScripts)  {
    		
            ProcessBuilder processBuilder = new ProcessBuilder("python", script);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

         
    	}
    }
}