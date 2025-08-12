package com.wiily.pscosmeticos.PsAPI.infra.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.wiily.pscosmeticos.PsAPI.domain.user.User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class TokenService {
    public String genToken(User user) {
        try {
            var algorithm = Algorithm.HMAC256("123456");
            System.out.println(Instant.now().plus(2, ChronoUnit.HOURS));
            return JWT.create()
                    .withIssuer("API PS")
                    .withSubject(user.getUsername())
                    .withExpiresAt(expireDate())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Error in: ", exception);
        }
    }

    private Instant expireDate() {
        return Instant.now().plus(2, ChronoUnit.HOURS);
    }

    public String getSubject(String tokenJWT) {
        try {
            var algorithm = Algorithm.HMAC256("123456");
            return JWT.require(algorithm)
                    .withIssuer("API PS")
                    .build()
                    .verify(tokenJWT)
                    .getSubject();
        } catch (JWTVerificationException e) {
            throw new RuntimeException(e);
        }

    }
}
