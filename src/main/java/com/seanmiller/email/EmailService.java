package com.seanmiller.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

	@Autowired
	private JavaMailSender jms;

	public void sendInvoiceToRetailer(String email, byte[] invoiceBytes) {
		try {
			MimeMessage message = jms.createMimeMessage();
			MimeMessageHelper mmh = new MimeMessageHelper(message, true);
			mmh.setTo(email);
			mmh.setSubject("Your invoice for the Clothing Delivery");
			mmh.setText("Please find your invoice attached.", true);

			ByteArrayResource resource = new ByteArrayResource(invoiceBytes);
			mmh.addAttachment("invoice.pdf", resource);

			jms.send(message);
		} catch (Exception e) {
			throw new RuntimeException("Error sending email", e);
		}
	}
}
