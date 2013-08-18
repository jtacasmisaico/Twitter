package com.springapp.mvc.data;

import com.springapp.mvc.cache.CacheManager;
import com.springapp.mvc.model.AuthenticatedUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 22/7/13
 * Time: 6:25 PM
 */
@Repository
public class AuthenticationRepository {
    private final JdbcTemplate jdbcTemplate;
    private final CacheManager cacheManager;

    @Autowired
    public AuthenticationRepository(JdbcTemplate jdbcTemplate, CacheManager cacheManager) {
        this.jdbcTemplate = jdbcTemplate;
        this.cacheManager = cacheManager;
    }

    public String addSession(AuthenticatedUser authenticatedUser) {
        cacheManager.set("session"+authenticatedUser.getUserid(), authenticatedUser);
        final SimpleJdbcInsert insert = new SimpleJdbcInsert(jdbcTemplate);
        insert.setTableName("sessions");
        insert.setColumnNames(Arrays.asList("sessionid", "userid"));
        Map<String, Object> param = new HashMap<>();
        param.put("sessionid", authenticatedUser.getSessionid());
        param.put("userid", authenticatedUser.getUserid());
        try{
            insert.execute(param);
            return "Success";
        }
        catch(Exception e){
            e.printStackTrace();
            return "Error";
        }
    }

    public String insertToken(String token, String consumerid) {
        final SimpleJdbcInsert insert = new SimpleJdbcInsert(jdbcTemplate);
        insert.setTableName("requesttokens");
        insert.setColumnNames(Arrays.asList("token", "consumerid"));
        Map<String, Object> param = new HashMap<>();
        param.put("token", token);
        param.put("consumerid", consumerid);
        try{
            insert.execute(param);
            return token;
        }
        catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public void invalidateSessions() {
        try {
            jdbcTemplate.update("delete from sessions where timestamp < 'now()'");
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }

    public void endSession(AuthenticatedUser authenticatedUser) {
        try {
            jdbcTemplate.update("delete from sessions where sessionid = \'"+authenticatedUser.getSessionid()+"\' and userid " +
                " = "+authenticatedUser.getUserid());
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }

    public boolean isValidSession(AuthenticatedUser authenticatedUser) {
        if(cacheManager.exists("session"+authenticatedUser.getUserid())) {
            return true;
        }
        int count =  jdbcTemplate.queryForInt("SELECT count(*) FROM sessions WHERE sessionid = ? and userid= ?",
                new Object[]{authenticatedUser.getSessionid(), authenticatedUser.getUserid()});
        if(count>0) {
            cacheManager.set("session"+authenticatedUser.getUserid(), authenticatedUser);
            return true;
        }
        else return false;
    }

    public boolean isValidToken(String token) {
        int count =  jdbcTemplate.queryForInt("SELECT count(*) FROM requesttokens WHERE token = ?",
                new Object[]{token});
        System.out.println("Count : "+count);
        if(count>0) return true;
        else return false;
    }

    public void authorizeRequestToken(String token) {
        try {
            jdbcTemplate.update("UPDATE requesttokens SET isauthorized = \'TRUE\' WHERE token = '"+token+"\'");
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }

}
