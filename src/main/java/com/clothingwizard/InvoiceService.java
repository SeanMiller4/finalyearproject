package com.clothingwizard;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;


@Service
public class InvoiceService {
		
	public byte[] generateInvoice(PotentialRetailer pr, Order order) throws IOException {
		try(PDDocument document = new PDDocument()) {
			PDPage page = new PDPage();
			document.addPage(page);
			
			try(PDPageContentStream cs = new PDPageContentStream(document,page)) {
				cs.beginText();
				cs.newLineAtOffset(50, 750);
				cs.setFont(PDType1Font.HELVETICA_BOLD, 20);
				cs.showText("Invoice");
				cs.endText();
				
				cs.beginText();
				cs.newLineAtOffset(50, 700);
				cs.setFont(PDType1Font.HELVETICA_BOLD, 20);
				cs.showText("Retailer: " + pr.getName());
				cs.endText();
				
				cs.beginText();
				cs.newLineAtOffset(50, 680);
				cs.setFont(PDType1Font.HELVETICA_BOLD, 20);
				cs.showText("Product: " + pr.getProduct());
				cs.endText();
				
				cs.beginText();
				cs.newLineAtOffset(50, 660);
				cs.setFont(PDType1Font.HELVETICA_BOLD, 20);
				cs.showText("Price Per Unit: " + order.getPrice());
				cs.endText();
				
				cs.beginText();
				cs.newLineAtOffset(50, 640);
				cs.setFont(PDType1Font.HELVETICA_BOLD, 20);
				cs.showText("Quantity (in Units): " + order.getQuantity());
				cs.endText();
				
				cs.beginText();
				cs.newLineAtOffset(50, 620);
				cs.setFont(PDType1Font.HELVETICA_BOLD, 20);
				cs.showText("Total Price: " + (order.getQuantity() * order.getPrice()));
				cs.endText();
			}
			
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			document.save(baos);
			return baos.toByteArray();
		}
	}
}