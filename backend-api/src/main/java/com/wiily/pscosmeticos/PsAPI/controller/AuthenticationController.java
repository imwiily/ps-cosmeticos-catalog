package com.wiily.pscosmeticos.PsAPI.controller;

import com.wiily.pscosmeticos.PsAPI.domain.user.User;
import com.wiily.pscosmeticos.PsAPI.infra.security.AuthenticationDTO;
import com.wiily.pscosmeticos.PsAPI.infra.security.TokenDTO;
import com.wiily.pscosmeticos.PsAPI.infra.security.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/login")
public class AuthenticationController {
    @Autowired
    AuthenticationManager manager;

    @Autowired
    TokenService service;

    @PostMapping
    public ResponseEntity<Object> login(@RequestBody @Valid AuthenticationDTO dto) {
        var token = new UsernamePasswordAuthenticationToken(dto.username(), dto.password());
        var authentication = manager.authenticate(token);
        TokenDTO tokenDTO = new TokenDTO(service.genToken((User) authentication.getPrincipal()), ((User) authentication.getPrincipal()).getUsername());
        return ResponseEntity.ok(tokenDTO);
    }
}
