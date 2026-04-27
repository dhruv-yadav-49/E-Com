package com.telu.ecom_project.service;

import java.sql.Date;
import java.time.Instant;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Service
public class VerificationTokenService {

    private SecretKey secretKey;

    @Value("${app.jwt.secret}")
    private String baseSecret;

    @Value("${app.verification.expiration-ms:600000}") // 10 minutes default
    private long expirationMs;

    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(baseSecret.getBytes());
    }

    public String generateEmailVerificationToken(String email) {
        Instant now = Instant.now();
        Instant exp = now.plusMillis(expirationMs);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .claim("type", "email-verification")
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

   
    public Optional<String> validateAndExtractEmail(String token) {
        try {
            var claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            if (!"email-verification".equals(claims.get("type", String.class))) {
                return Optional.empty();
            }

            return Optional.ofNullable(claims.getSubject());

        } catch (Exception ex) {
            return Optional.empty();
        }
    }
}