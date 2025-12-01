package com.hospital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
public class HospitalManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalManagementApplication.class, args);
        System.out.println("==============================================");
        System.out.println("Hospital Management System Started Successfully");
        System.out.println("==============================================");
        System.out.println("API Documentation: http://localhost:8080/api/swagger-ui.html");
        System.out.println("API Endpoints: http://localhost:8080/api");
        System.out.println("==============================================");
    }
}
