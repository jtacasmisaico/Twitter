package com.springapp.mvc.service;

import com.springapp.mvc.cache.CacheManager;
import com.springapp.mvc.data.TweetRepository;
import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.Tweet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 11/8/13
 * Time: 9:00 AM
 */
@Service
public class TweetService {
    private final TweetRepository tweetRepository;
    private final CacheManager cacheManager;
    @Autowired
    public TweetService(TweetRepository tweetRepository, CacheManager cacheManager) {
        this.tweetRepository = tweetRepository;
        this.cacheManager = cacheManager;
    }

    @Scheduled(fixedDelay = 60000)
    public void refreshTrending() {
        cacheManager.delete("trending");
        tweetRepository.fetchTrending();
    }

    public Tweet findTweetByTweetId(int tweetid) {
        return tweetRepository.findTweetByTweetId(tweetid);
    }

    public List<Tweet> searchTweet(String keyword, int lastTweet, int limit) {
        return tweetRepository.searchTweet(keyword, lastTweet, limit);
    }

    public Tweet createTweet(Tweet tweet, HttpServletRequest request, HttpServletResponse response) {
        int id = tweetRepository.createTweet(HtmlUtils.htmlEscape(tweet.getContent()),
                Integer.parseInt(request.getHeader("userid")));
        if (id != -1){
            createHashTag(id, tweet.getContent());
            response.setStatus(200);
            return this.findTweetByTweetId(id);
        }
        response.setStatus(403);
        return null;
    }

    public List<Tweet> findTweetsByUserId(int userid, int lastTweet, int limit) {
        return tweetRepository.findTweetsByUserId(userid, lastTweet, limit);
    }

    public List<Tweet> fetchFeed(HttpServletRequest request, int lastTweet, int limit) {
        int userid = Integer.parseInt(request.getHeader("userid"));
        return tweetRepository.fetchFeed(userid, lastTweet, limit);
    }

    public List<Tweet> fetchNewFeed(HttpServletRequest request, int tweetid) {
        int userid = Integer.parseInt(request.getHeader("userid"));
        return tweetRepository.fetchNewFeed(userid, tweetid);
    }

    public List<Tweet> fetchHashTag(String tag) {
        return tweetRepository.fetchHashTag(tag.toLowerCase());
    }

    public void createHashTag(int id, String tweet) {
        ArrayList <String> hashTags = new ArrayList<>();
        System.out.println("Trying to create hashtag");
        String patternStr = "(?:\\s|\\A)[##]+([A-Za-z0-9-_]+)";
        Pattern pattern = Pattern.compile(patternStr);
        Matcher matcher = pattern.matcher(tweet);
        while(matcher.find()) {
            String result = matcher.group();
            result = result.replace(" ", "");
            result = result.replace("#", "");
            System.out.println(result);
            hashTags.add(result.toLowerCase());
        }
        Set uniqueHashTags = new TreeSet(String.CASE_INSENSITIVE_ORDER);
        uniqueHashTags.addAll(hashTags);
        tweetRepository.insertHashTag(id, new ArrayList(uniqueHashTags));
    }

    public void refreshHashes(int tweetId) {
        List<Tweet> tweets = tweetRepository.fetchAllTweets(tweetId);
        for(Tweet tweet : tweets) {
            System.out.println("Paesing : "+tweet.getTweetid());
            createHashTag(tweet.getTweetid(), tweet.getContent());
        }
    }

    public List<String> fetchTrending() {
        return tweetRepository.fetchTrending();
    }
}
