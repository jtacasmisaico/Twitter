package com.springapp.mvc.model;

import org.codehaus.jackson.annotate.JsonIgnore;

import java.sql.Timestamp;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 19/7/13
 * Time: 8:26 PM
 */
public class Tweet {
    private int tweetid;
    private String content;
    private int userid;
    private String username;
    private String image;
    private Timestamp timestamp;

    public int getTweetid() {
        return tweetid;
    }

    public String getContent() {
        return content;
    }

    public int getUserid() {
        return userid;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public String getUsername() {
        return username;
    }

    public String getImage() {
        return image;
    }

    public void setTweetid(int tweetid) {
        this.tweetid = tweetid;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setUserid(int userid) {
        this.userid = userid;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setImage(String image) {
        this.image = image;
    }

}
