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
            return jdbcTemplate.queryForObject("select tweets.tweetid, tweets.content, tweets.userid, tweets.timestamp, users.username, users.image from tweets inner join users on users.userid = tweets.userid where tweets.tweetid = ?",
                    new Object[]{tweetid}, new BeanPropertyRowMapper<>(Tweet.class));
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Tweet> findTweetsByUserId(int userid, int offset, int limit) {
        try {
            return jdbcTemplate.query("select tweets.tweetid, tweets.content, tweets.userid, tweets.timestamp, users.username, users.image from tweets inner join users on users.userid = tweets.userid where tweets.userid = ? ORDER BY tweets.timestamp DESC OFFSET ? LIMIT ?",
                    new Object[]{userid, offset, limit}, new BeanPropertyRowMapper<>(Tweet.class));
        }
        catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Tweet> searchTweet(String keyword, int offset, int limit) {
        try {
            return jdbcTemplate.query("select tweets.tweetid, tweets.content, tweets.userid, tweets.timestamp, " +
                    "users.username, users.image from tweets inner join users on users.userid = tweets.userid where " +
                    "lower(content) like \'%"+keyword.toLowerCase()+"%\' OFFSET ? LIMIT ?",
                    new Object[]{offset, limit}, new BeanPropertyRowMapper<>(Tweet.class));
        }
        catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public int createTweet(String content, int userid) {
        if(content.length()<1 || content.length()>140) return -1;
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

    public List<Tweet> fetchFeed(int userid, int lastTweet, int limit) {
        try {
            return jdbcTemplate.query("select tweets.tweetid, tweets.content, tweets.userid, tweets.timestamp, users.username, users.image from tweets, users, followers where followers.followed=tweets.userid and followers.follower =  ? and tweets.timestamp < followers.unfollowedat and users.userid = tweets.userid and tweets.tweetid < "+lastTweet+"  union select tweets.tweetid, tweets.content, tweets.userid, tweets.timestamp, users.username, users.image from tweets, users where tweets.userid = users.userid and tweets.userid = ? and tweets.tweetid < "+lastTweet+" order by timestamp DESC LIMIT ?",
                    new Object[]{userid, userid, limit},
                    new BeanPropertyRowMapper<>(Tweet.class));
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Tweet> fetchNewFeed(int userid, int tweetid) {
        try {
            return jdbcTemplate.query("select tweets.tweetid, tweets.content, tweets.userid, tweets.timestamp, users.username, users.image from tweets, users, followers where followers.followed=tweets.userid and followers.follower  = ? and tweets.timestamp < followers.unfollowedat and users.userid = tweets.userid and tweets.tweetid > ?" +
                    "order by timestamp DESC",
                    new Object[]{userid, tweetid},
                    new BeanPropertyRowMapper<>(Tweet.class));
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}


