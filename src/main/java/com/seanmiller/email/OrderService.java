package com.seanmiller.email;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seanmiller.entity.Order;
import com.seanmiller.entity.PotentialRetailer;
import com.seanmiller.repository.OrderRepository;
import com.seanmiller.repository.RetailerRepository;

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
	
	public byte[] createOrder(Order order) throws IOException {
				 
		 orderRepository.save(order);
		 
		 PotentialRetailer retailer = retailerRepository.findByName(order.getRetailer());
		 
		 byte[] invoiceBytes = invoiceService.generateInvoice(retailer, order);
		 
		 emailService.sendInvoiceToRetailer(retailer.getEmail(), invoiceBytes);
		 
		 return invoiceBytes;
	}
}