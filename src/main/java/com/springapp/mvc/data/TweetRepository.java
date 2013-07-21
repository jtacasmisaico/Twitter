package com.springapp.mvc.data;

import com.springapp.mvc.model.Tweet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class TweetRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public TweetRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Tweet findByTweetId(Long tweetid) {
        try {
            System.out.println("Tweet : "+tweetid);
            return jdbcTemplate.queryForObject("select tweetid, content, userid, timestamp from tweets where tweetid = ?",
                    new Object[]{tweetid}, new BeanPropertyRowMapper<>(Tweet.class));
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Tweet> findByUserId(int userid) {
        try {
            return jdbcTemplate.query("select tweetid, content, timestamp from tweets where userid= ?",
                    new Object[]{userid}, new BeanPropertyRowMapper<>(Tweet.class));
        }
        catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public int createTweet(String content, int userid) {
        final SimpleJdbcInsert insert = new SimpleJdbcInsert(jdbcTemplate);
        insert.setTableName("tweets");
        insert.setColumnNames(Arrays.asList("content", "userid"));
        insert.setGeneratedKeyName("tweetid");
        Map<String, Object> param = new HashMap<>();
        param.put("content", content);
        param.put("userid", userid);
        try{
            return  (int) insert.executeAndReturnKey(param);
        }
        catch(Exception e){
            e.printStackTrace();
            return -1;
        }
    }
}
