package com.springapp.mvc.data;

import com.springapp.mvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.*;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public User findById(int id) {
        try {
            return jdbcTemplate.queryForObject("select name, userid, username, email from users where userid = ?",
                new Object[]{id}, new BeanPropertyRowMapper<>(User.class));
        }
        catch (Exception e) {
            return null;
        }
    }

    public User findByEmail(String email) {
        try {
            return jdbcTemplate.queryForObject("select userid, name, username, password from users where email = ?",
                new Object[]{email}, new BeanPropertyRowMapper<>(User.class));
        }
        catch(Exception e) {
            return null;
        }
    }

    public User findByUsername(String username) {
        try {
            return jdbcTemplate.queryForObject("select name, userid, username, email from users where username = ?",
                    new Object[]{username}, new BeanPropertyRowMapper<>(User.class));
        }
        catch(Exception e) {
            return null;
        }
    }

    public int createUser(String username, String name, String email, String password) {
        System.out.println(username+":"+password+":"+email+":"+name);
        final SimpleJdbcInsert insert = new SimpleJdbcInsert(jdbcTemplate);
        insert.setTableName("users");
        insert.setColumnNames(Arrays.asList("username", "password", "email", "name"));
        insert.setGeneratedKeyName("userid");
        Map<String, Object> param = new HashMap<>();
        param.put("username", username);
        param.put("password", password);
        param.put("name", name);
        param.put("email", email);
        try{
            return (int) insert.executeAndReturnKey(param);
        }
        catch( DuplicateKeyException e){
            return -1;
        }
    }

    public boolean alreadyFollowing(int follower, int followed) {
        int count =  jdbcTemplate.queryForInt("SELECT count(*) FROM followers WHERE follower = ? and followed = " +
                "?", new Object[]{follower, followed});
        if(count>0) return true;
        else return false;
    }

    public String follow(int follower, int followed) {
        if(alreadyFollowing(follower, followed)) {
            try {
                jdbcTemplate.update("update followers set unfollowedat='infinity' where follower=? and followed=?",
                        new Object[]{follower, followed});
                return "Success";
            }
            catch(Exception e) {
                e.printStackTrace();
                return "Error";
            }
        }
        else {
            final SimpleJdbcInsert insert = new SimpleJdbcInsert(jdbcTemplate);
            insert.setTableName("followers");
            insert.setColumnNames(Arrays.asList("follower", "followed"));
            Map<String, Object> param = new HashMap<>();
            param.put("follower", follower);
            param.put("followed", followed);
            try{
                insert.execute(param);
                return "Success";
            }
            catch(Exception e){
                e.printStackTrace();
                return "Error";
            }
        }
    }
    public String unfollow(int follower, int followed) {
        try{
            jdbcTemplate.update("update followers set unfollowedat=? where follower=? and followed=?",
                    new Object[]{new Timestamp(new Date().getTime()), follower, followed});
            return "Success";
        }
        catch(Exception e){
            e.printStackTrace();
            return "Error";
        }
    }

    public List<User> fetchFollowers(int userid) {
        try {
                return jdbcTemplate.query("select name, users.userid, users.username, users.email, users.name from followers inner join users on followers.follower=users.userid where followers.followed  = ? and followers.unfollowedat > ?",
                    new Object[]{userid, new Timestamp(new Date().getTime())}, new BeanPropertyRowMapper<>(User.class));
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<User> fetchFollows(int userid) {
        try {
            return jdbcTemplate.query("select name, users.userid, users.username, users.email, users.name from followers inner join users on followers.followed=users.userid where followers.follower  = ? and followers.unfollowedat > ?",
                    new Object[]{userid, new Timestamp(new Date().getTime())}, new BeanPropertyRowMapper<>(User.class));
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
