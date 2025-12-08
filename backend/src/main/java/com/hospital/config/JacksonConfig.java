package com.hospital.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.time.format.DateTimeFormatter;

/**
 * Jackson configuration for date formatting
 * System-wide DD/MM/YYYY format for all date and datetime fields
 */
@Configuration
public class JacksonConfig {

    // DD/MM/YYYY format
    public static final String DATE_FORMAT = "dd/MM/yyyy";
    public static final String DATETIME_FORMAT = "dd/MM/yyyy HH:mm:ss";

    public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern(DATE_FORMAT);
    public static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern(DATETIME_FORMAT);

    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        
        // Configure LocalDate serialization (DD/MM/YYYY)
        javaTimeModule.addSerializer(java.time.LocalDate.class, 
            new LocalDateSerializer(DATE_FORMATTER));
        
        // Configure LocalDateTime serialization (DD/MM/YYYY HH:mm:ss)
        javaTimeModule.addSerializer(java.time.LocalDateTime.class, 
            new LocalDateTimeSerializer(DATETIME_FORMATTER));

        ObjectMapper objectMapper = builder.createXmlMapper(false).build();
        objectMapper.registerModule(javaTimeModule);
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        
        return objectMapper;
    }
}
