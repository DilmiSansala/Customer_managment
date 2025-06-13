package com.convergence.customermanagement.repository;

import com.convergence.customermanagement.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    // Find customer by NIC number
    Optional<Customer> findByNicNumber(String nicNumber);
    
    // Check if NIC number exists
    boolean existsByNicNumber(String nicNumber);
}