package com.convergence.customermanagement.controller;

import com.convergence.customermanagement.entity.Customer;
import com.convergence.customermanagement.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    // GET /api/customers - Get all customers
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        try {
            List<Customer> customers = customerRepository.findAll();
            return new ResponseEntity<>(customers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET /api/customers/{id} - Get customer by ID
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable("id") Long id) {
        Optional<Customer> customerData = customerRepository.findById(id);
        
        if (customerData.isPresent()) {
            return new ResponseEntity<>(customerData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // GET /api/customers/nic/{nicNumber} - Get customer by NIC
    @GetMapping("/nic/{nicNumber}")
    public ResponseEntity<Customer> getCustomerByNic(@PathVariable("nicNumber") String nicNumber) {
        Optional<Customer> customerData = customerRepository.findByNicNumber(nicNumber);
        
        if (customerData.isPresent()) {
            return new ResponseEntity<>(customerData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // POST /api/customers - Create new customer
    @PostMapping
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer) {
        try {
            // Check if NIC already exists
            if (customerRepository.existsByNicNumber(customer.getNicNumber())) {
                return new ResponseEntity<>(null, HttpStatus.CONFLICT);
            }
            
            Customer savedCustomer = customerRepository.save(customer);
            return new ResponseEntity<>(savedCustomer, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // PUT /api/customers/{id} - Update customer
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable("id") Long id, 
                                                  @Valid @RequestBody Customer customer) {
        Optional<Customer> customerData = customerRepository.findById(id);
        
        if (customerData.isPresent()) {
            Customer existingCustomer = customerData.get();
            
            // Check if NIC is being changed and if new NIC already exists
            if (!existingCustomer.getNicNumber().equals(customer.getNicNumber()) && 
                customerRepository.existsByNicNumber(customer.getNicNumber())) {
                return new ResponseEntity<>(null, HttpStatus.CONFLICT);
            }
            
            existingCustomer.setName(customer.getName());
            existingCustomer.setNicNumber(customer.getNicNumber());
            existingCustomer.setDateOfBirth(customer.getDateOfBirth());
            
            return new ResponseEntity<>(customerRepository.save(existingCustomer), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // DELETE /api/customers/{id} - Delete customer
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteCustomer(@PathVariable("id") Long id) {
        try {
            if (customerRepository.existsById(id)) {
                customerRepository.deleteById(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET /api/customers/count - Get total customer count
    @GetMapping("/count")
    public ResponseEntity<Long> getCustomerCount() {
        try {
            long count = customerRepository.count();
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}