package com.telu.ecom_project.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.telu.ecom_project.model.User;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    Optional<User> findByPasswordResetToken(String token);

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    Long getActiveUsers();

    @Query(value = "SELECT DATE_FORMAT(created_at, '%b %Y') AS month, COUNT(user_id) " +
                   "FROM users WHERE created_at >= :sixMonthsAgo " +
                   "GROUP BY DATE_FORMAT(created_at, '%b %Y'), YEAR(created_at), MONTH(created_at) " +
                   "ORDER BY YEAR(created_at), MONTH(created_at)", nativeQuery = true)
    java.util.List<Object[]> getNewUsersByMonth(@org.springframework.data.repository.query.Param("sixMonthsAgo") java.time.LocalDateTime sixMonthsAgo);
}
