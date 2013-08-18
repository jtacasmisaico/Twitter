package com.springapp.mvc;

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
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

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
    public PropertySourcesPlaceholderConfigurer propertiesConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

    @Bean
    public static JedisPool jedis() {
        return new JedisPool(new JedisPoolConfig(), "localhost");
    }

}
