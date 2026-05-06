package com.telu.ecom_project.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.telu.ecom_project.model.ReturnRequest;
import java.util.List;

@Repository
public interface ReturnRequestRepo extends JpaRepository<ReturnRequest, Long> {

    @Query("SELECT r FROM ReturnRequest r WHERE r.userEmail = ?1")
    List<ReturnRequest> findByEmail(String email);

    @Query("SELECT COUNT(r) FROM ReturnRequest r WHERE r.status = 'PENDING'")
    long countPendingReturns();

    @Query("SELECT COUNT(r) FROM ReturnRequest r WHERE r.status != 'PENDING'")
    long countResolvedReturns();
}
