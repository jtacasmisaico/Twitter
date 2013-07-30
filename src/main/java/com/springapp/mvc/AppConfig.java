package com.springapp.mvc;

import com.springapp.mvc.web.AuthenticationInterceptor;
import com.springapp.mvc.web.CORSInterceptor;
import org.postgresql.ds.PGPoolingDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.beans.PropertyVetoException;

/**
* Created with IntelliJ IDEA.
* User: vishnu
* Date: 11/7/13
* Time: 4:36 PM
* To change this template use File | Settings | File Templates.
*/
@Configuration
@ComponentScan(basePackages = "com.springapp.mvc")
@PropertySource(value = "classpath:/dev/application.properties")
@EnableWebMvc
@EnableTransactionManagement
public class AppConfig extends WebMvcConfigurerAdapter {

    @Bean
    public JdbcTemplate jdbcTemplate(@Value("${db.url}") String url,
                                     @Value("${db.port}") int port,
                                     @Value("${db.username}") String username,
                                     @Value("${db.password}") String password,
                                     @Value("${db.database}") String database) throws PropertyVetoException {
        PGPoolingDataSource source = new PGPoolingDataSource();
        source.setServerName(url);
        source.setPortNumber(port);
        source.setDatabaseName(database);
        source.setUser(username);
        source.setPassword(password);
        return new JdbcTemplate(source);
    }

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertiesConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry){
        registry.addInterceptor(new AuthenticationInterceptor()).addPathPatterns("/users/follow");
        registry.addInterceptor(new AuthenticationInterceptor()).addPathPatterns("/users/unfollow");
        registry.addInterceptor(new AuthenticationInterceptor()).addPathPatterns("/users/image/create");
        registry.addInterceptor(new AuthenticationInterceptor()).addPathPatterns("/post/tweet");
        registry.addInterceptor(new AuthenticationInterceptor()).addPathPatterns("/fetch/feed");
        registry.addInterceptor(new AuthenticationInterceptor()).addPathPatterns("/fetch/feed/latest");

        registry.addInterceptor(new CORSInterceptor()).addPathPatterns("/users/followers/*");
        registry.addInterceptor(new CORSInterceptor()).addPathPatterns("/users/follows/*");
        registry.addInterceptor(new CORSInterceptor()).addPathPatterns("/users/check/follows/*");
        registry.addInterceptor(new CORSInterceptor()).addPathPatterns("/fetch/tweets/*");
        registry.addInterceptor(new CORSInterceptor()).addPathPatterns("/fetch/posts/*");
    }
}
