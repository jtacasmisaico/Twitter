package com.springapp.mvc.data;

import com.google.gson.reflect.TypeToken;
import com.springapp.mvc.cache.CacheManager;
import com.springapp.mvc.model.Tweet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;

@Repository
public class TweetRepository {

    private final JdbcTemplate jdbcTemplate;
    private final CacheManager cacheManager;

    @Autowired
    public TweetRepository(JdbcTemplate jdbcTemplate, CacheManager cacheManager) {
        this.jdbcTemplate = jdbcTemplate;
        this.cacheManager = cacheManager;
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

    public List<Tweet> findTweetsByUserId(int userid, int lastTweet, int limit) {
        try {
            if(cacheManager.exists("posts:"+userid+":"+lastTweet+":"+limit)) {
                List<Tweet> posts = Arrays.asList(cacheManager.getTweetList
                        ("posts:"+userid+":"+lastTweet+":"+limit));
                return posts;
            }
            List<Tweet> posts = jdbcTemplate.query("select tweets.tweetid, tweets.content, tweets.userid, " +
                    "tweets.timestamp, users.username, users.image from tweets inner join users on users.userid = tweets.userid where tweets.userid = ? and tweets.tweetid < ? ORDER BY tweets.timestamp DESC LIMIT ?",
                    new Object[]{userid, lastTweet, limit}, new BeanPropertyRowMapper<>(Tweet.class));
            cacheManager.set("posts:"+userid+":"+lastTweet+":"+limit, posts, 60);
            return posts;
        }
        catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Tweet> searchTweet(String keyword, int lastTweet, int limit) {
        try {
            if(cacheManager.exists("search:"+keyword+":"+lastTweet+":"+limit)){
                List<Tweet> results =  Arrays.asList(cacheManager.getTweetList("search:" + keyword + ":" + lastTweet + ":" +
                        limit));
                return results;
            }

            List<Tweet> cachedResult = jdbcTemplate.query("select tweets.tweetid, tweets.content, tweets.userid, " +
                    "tweets.timestamp, " +
                    "users.username, users.image from tweets inner join users on users.userid = tweets.userid where lower(content) like '%"+keyword.toLowerCase()+"%' and tweetid < ? ORDER BY tweetid DESC LIMIT ?",
                    new Object[]{lastTweet, limit}, new BeanPropertyRowMapper<>(Tweet.class));
            cacheManager.set("search:"+keyword+":"+lastTweet+":"+limit, cachedResult, 300);
            return cachedResult;
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

    public List<Tweet> fetchHashTag(String tag) {
        try {
            if(cacheManager.exists("hashtag:"+tag)) {
                return Arrays.asList(cacheManager.getTweetList("hashtag:"+tag));
            }
            else {
                List<Tweet> result = jdbcTemplate.query("select tweets.tweetid, tweets.content, tweets.userid, " +
                        "tweets.timestamp, " +
                        "users.username, users.image from tweets, users, hashtags where tweets.tweetid = hashtags.tweetid and users.userid = tweets.userid and hashtags.tag = ? ORDER BY tweetid DESC LIMIT 20",
                        new Object[]{tag},
                        new BeanPropertyRowMapper<>(Tweet.class));
                cacheManager.set("hashtag:"+tag, result, 300);
                return result;
            }
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    public void insertHashTag(int tweetId, ArrayList<String> hashTags) {
        final SimpleJdbcInsert insert = new SimpleJdbcInsert(jdbcTemplate);
        Map batch[] = new Map[hashTags.size()];
        insert.setTableName("hashtags");
        insert.setColumnNames(Arrays.asList("tweetid", "tag"));
        for(int i = 0; i< hashTags.size(); i++) {
            if(cacheManager.exists("hashtag:"+hashTags.get(i))) cacheManager.delete("hashtag:"+hashTags.get(i));
            Map<String, Object> param = new HashMap<>();
            param.put("tweetid", tweetId);
            param.put("tag", hashTags.get(i));
            batch[i] = param;
        }
        try{
            insert.executeBatch(batch);
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }
    public List<Tweet> fetchAllTweets(int tweetId) {
        try {
            return jdbcTemplate.query("select tweets.tweetid, tweets.content from tweets where tweets.tweetid < ?",
                    new Object[]{tweetId},
                    new BeanPropertyRowMapper<>(Tweet.class));
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<String> fetchTrending() {
        if(cacheManager.exists("trending"))
            return Arrays.asList(cacheManager.getStringList("trending"));
        else {
            int lastTweet = jdbcTemplate.queryForInt("SELECT MAX(tweetid) from tweets");
            List<String> results = jdbcTemplate.queryForList("SELECT tag FROM hashtags WHERE tweetid > ? GROUP BY tag ORDER BY COUNT(tag) DESC LIMIT 10", new Object[]{lastTweet-100000}, String.class);
            String[] trending = results.toArray(new String[results.size()]);
            cacheManager.set("trending", trending, 60);
            return results;
        }
    }
}


