package com.wiily.pscosmeticos.PsAPI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
@SpringBootApplication
public class PsApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(PsApiApplication.class, args);
		System.out.println("""
				=======================================
				--------- Application Started ---------
				=======================================
				""");
	}

}
