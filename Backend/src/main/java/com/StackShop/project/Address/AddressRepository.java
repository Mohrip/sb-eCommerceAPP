package com.StackShop.project.Address;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Integer> {

    // Optimized query to fetch addresses with user in single query
    @Query("SELECT a FROM Address a LEFT JOIN FETCH a.user")
    List<Address> findAllWithUser();
}
