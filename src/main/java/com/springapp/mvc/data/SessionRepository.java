package com.springapp.mvc.data;

import com.springapp.mvc.model.Session;
import com.springapp.mvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 22/7/13
 * Time: 6:25 PM
 */
@Repository
public class SessionRepository {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public SessionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String addSession(Session session) {
        final SimpleJdbcInsert insert = new SimpleJdbcInsert(jdbcTemplate);
        insert.setTableName("sessions");
        insert.setColumnNames(Arrays.asList("sessionid", "userid"));
        Map<String, Object> param = new HashMap<>();
        param.put("sessionid", session.getSessionid());
        param.put("userid", session.getUserid());
        try{
            insert.execute(param);
            return "Success";
        }
        catch(Exception e){
            e.printStackTrace();
            return "Error";
        }
    }

    public void endSession(Session session) {
    }

    public boolean isValidSession(Session session) {
        int count =  jdbcTemplate.queryForInt("SELECT count(*) FROM sessions WHERE sessionid = ? and userid= ?",
                new Object[]{session.getSessionid(), session.getUserid()});
        System.out.println("Count : "+count);
        if(count>0) return true;
        else return false;
    }
}
