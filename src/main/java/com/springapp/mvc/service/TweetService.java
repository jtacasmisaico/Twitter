package com.springapp.mvc.service;

import com.springapp.mvc.cache.CacheManager;
import com.springapp.mvc.data.TweetRepository;
import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.Tweet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

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
}
