package com.clothingwizard;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
	
	@Autowired
	private OrderRepository orderRepository;
	
	@Autowired
	private RetailerRepository retailerRepository;
	
	@Autowired
	private InvoiceService invoiceService;
	
	@Autowired
	private EmailService emailService;
	
	public byte[] createOrder(Long retailerId, String product, double price, int quantity) throws IOException {
		
		 PotentialRetailer retailer = retailerRepository.findById(retailerId).orElseThrow(() -> new RuntimeException("Retailer not found"));	
		 
		 Order order = new Order();
		 order.setRetailer(retailer.getName());
		 order.setProduct(product);
		 order.setPrice(price);
		 order.setQuantity(quantity);
		 orderRepository.save(order);
		 
		 byte[] invoiceBytes = invoiceService.generateInvoice(retailer, order);
		 
		 emailService.sendInvoiceToRetailer(retailer.getEmail(), invoiceBytes);
		 
		 return invoiceBytes;
	}
}