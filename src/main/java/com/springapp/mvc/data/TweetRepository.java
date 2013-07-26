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

    public Tweet findTweetByTweetId(int tweetid) {
        try {
            System.out.println("Tweet : "+tweetid);
            return jdbcTemplate.queryForObject("select tweetid, content, userid, username, timestamp from tweets where tweetid = ?",
                    new Object[]{tweetid}, new BeanPropertyRowMapper<>(Tweet.class));
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Tweet> findTweetsByUserId(int userid, int offset, int limit) {
        try {
            return jdbcTemplate.query("select tweetid, content, userid, username, timestamp from tweets where userid= ? ORDER BY tweets.timestamp DESC OFFSET ? LIMIT ?",
                    new Object[]{userid, offset, limit}, new BeanPropertyRowMapper<>(Tweet.class));
        }
        catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public int createTweet(String content, int userid, String username) {
        System.out.println(username);
        final SimpleJdbcInsert insert = new SimpleJdbcInsert(jdbcTemplate);
        insert.setTableName("tweets");
        insert.setColumnNames(Arrays.asList("content", "userid", "username"));
        insert.setGeneratedKeyName("tweetid");
        Map<String, Object> param = new HashMap<>();
        param.put("content", content);
        param.put("userid", userid);
        param.put("username", username);
        try{
            return  (int) insert.executeAndReturnKey(param);
        }
        catch(Exception e){
            e.printStackTrace();
            return -1;
        }
    }

    public List<Tweet> fetchFeed(int userid, int offset, int limit) {
        try {
            return jdbcTemplate.query("select tweets.tweetid, tweets.content, tweets.userid, tweets.username, tweets.timestamp from tweets inner join followers on followers.followed=tweets.userid where followers.follower  = ? and tweets.timestamp < followers.unfollowedat ORDER BY tweets.timestamp DESC OFFSET ?  LIMIT ?",
                    new Object[]{userid, offset, limit},
                    new BeanPropertyRowMapper<>(Tweet.class));
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}


