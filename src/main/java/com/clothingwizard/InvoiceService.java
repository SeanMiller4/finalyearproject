package com.clothingwizard;

import java.io.IOException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.stereotype.Service;


@Service
public class InvoiceService {
		
	public byte[] generateInvoice(PotentialRetailer pr, Order order) throws IOException {
		try(PDDocument document = new PDDocument()) {
			PDPage page = new PDPage();
			document.addPage(page);
			
		}
		
	}

}
