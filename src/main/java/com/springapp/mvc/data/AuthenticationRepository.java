package com.springapp.mvc.data;

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

    @Autowired
    public AuthenticationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String addSession(AuthenticatedUser authenticatedUser) {
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
        int count =  jdbcTemplate.queryForInt("SELECT count(*) FROM sessions WHERE sessionid = ? and userid= ?",
                new Object[]{authenticatedUser.getSessionid(), authenticatedUser.getUserid()});
        if(count>0) return true;
        else return false;
    }

}
