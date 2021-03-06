package com.springapp.mvc.data;

import com.springapp.mvc.cache.CacheManager;
import com.springapp.mvc.model.Tweet;
import com.springapp.mvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.servlet.http.HttpServletResponse;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.sql.Timestamp;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;
    private final CacheManager cacheManager;
    @Autowired
    public UserRepository(JdbcTemplate jdbcTemplate, CacheManager cacheManager) {
        this.jdbcTemplate = jdbcTemplate;
        this.cacheManager = cacheManager;
    }

    public User findById(int id) {
        try {
            return jdbcTemplate.queryForObject("select name, userid, username, email, image from users where userid = ?",
                new Object[]{id}, new BeanPropertyRowMapper<>(User.class));
        }
        catch (Exception e) {
            return null;
        }
    }

    public User findByEmail(String email) {
        try {
            return jdbcTemplate.queryForObject("select userid, name, username, password, image from users where email = ?",
                new Object[]{email}, new BeanPropertyRowMapper<>(User.class));
        }
        catch(Exception e) {
            return null;
        }
    }

    public int findFollowersCount(int userid) {
        try{
            if(cacheManager.exists("followersCount:"+userid)) {
                return cacheManager.getInt("followersCount:"+userid);
            }
            int followersCount = jdbcTemplate.queryForInt("SELECT count(*) FROM followers WHERE followed = ? and unfollowedat > \'now()\'",
                    new Object[]{userid});
            cacheManager.set("followersCount:"+userid, followersCount);
            return followersCount;
        }
        catch(Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    public int findFollowingCount(int userid) {
        try{
            if(cacheManager.exists("followingCount:"+userid)) {
                return cacheManager.getInt("followingCount:"+userid);
            }
            int followingCount = jdbcTemplate.queryForInt("SELECT count(*) FROM followers WHERE follower = ? and unfollowedat > 'now()'",
                    new Object[]{userid});
            cacheManager.set("followingCount:"+userid, followingCount);
            return followingCount;
        }
        catch(Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    public User findByUsername(String username) {
        try {
            return jdbcTemplate.queryForObject("select name, userid, username, email, image from users where username = ?",
                    new Object[]{username}, new BeanPropertyRowMapper<>(User.class));
        }
        catch(Exception e) {
            return null;
        }
    }

    public String createUser(HttpServletResponse response, String username, String name, String email,
                             String password) {
        System.out.println("Creating user...");

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
            response.setStatus(200);
            insert.executeAndReturnKey(param);
            return "Success";
        }
        catch(Exception e){
            e.printStackTrace();
            response.setStatus(403);
            return "Email Address/Username already taken";
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
                if(cacheManager.exists("followersCount:"+followed))
                    cacheManager.set("followersCount:"+followed,cacheManager.getInt("followersCount:"+followed)+1);
                if(cacheManager.exists("followingCount:"+follower))
                    cacheManager.set("followingCount:"+follower,cacheManager.getInt("followingCount:"+follower)+1);
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
            if(cacheManager.exists("followersCount:"+followed))
                cacheManager.set("followersCount:"+followed,cacheManager.getInt("followersCount:"+followed)-1);
            if(cacheManager.exists("followingCount:"+follower))
                cacheManager.set("followingCount:"+follower,cacheManager.getInt("followingCount:"+follower)-1);
            return "Success";
        }
        catch(Exception e){
            e.printStackTrace();
            return "Error";
        }
    }

    public boolean checkFollows(int follower, int followed) {
        try{
            System.out.println("Checking follows");
            int count =  jdbcTemplate.queryForInt("SELECT count(*) FROM followers WHERE follower = ? and followed = " +
                    "? and unfollowedat = 'infinity'", new Object[]{follower, followed});
            System.out.println(count);
            if(count>0) return true;
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return false;
    }

    public List<User> fetchFollowers(int userid, int offset, int limit) {
        try {
                return jdbcTemplate.query("select name, users.userid, users.username, users.email, users.name, users.image from followers inner join users on followers.follower=users.userid where followers.followed  = ? and followers.unfollowedat > ? OFFSET ?  LIMIT ?",
                    new Object[]{userid, new Timestamp(new Date().getTime()), offset, limit},
                        new BeanPropertyRowMapper<>(User.class));
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<User> fetchFollows(int userid, int offset, int limit) {
        try {
            return jdbcTemplate.query("select name, users.userid, users.username, users.email, users.name, users.image from followers inner join users on followers.followed=users.userid where followers.follower  = ? and followers.unfollowedat > ? OFFSET ?  LIMIT ?",
                    new Object[]{userid, new Timestamp(new Date().getTime()), offset, limit},
                    new BeanPropertyRowMapper<>(User.class));
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    public String createImage(String image, int userid) {
        try{
            jdbcTemplate.update("update users set image=? where userid=?",
                    new Object[]{image, userid});
            return "Success";
        }
        catch(Exception e){
            e.printStackTrace();
            return "Error";
        }
    }

    public List<String> searchUsers(String username) {
        try {
            return jdbcTemplate.queryForList("select username from users where lower(username) like \'"+username
                    .toLowerCase()+"%\' LIMIT '5'", String.class);
        }
        catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<String> getAllUsers () {
        try {
            return jdbcTemplate.queryForList("select username from users", String.class);
        }
        catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
