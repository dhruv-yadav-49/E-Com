package com.telu.ecom_project.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.telu.ecom_project.model.Waitlist;

public interface WaitlistRepo extends JpaRepository<Waitlist, Long> {
    List<Waitlist> findByProductIdAndNotifiedFalse(Integer productId);
}
