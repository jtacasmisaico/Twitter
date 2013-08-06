package com.springapp.mvc.web;

import com.springapp.mvc.data.TweetRepository;
import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.Tweet;
import com.springapp.mvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.HtmlUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 19/7/13
 * Time: 8:35 PM
 */
@Controller
public class TweetController {
    private final TweetRepository tweetRepository;
    private final UserRepository userRepository;

    @Autowired
    public TweetController(TweetRepository tweetRepository, UserRepository userRepository) {
        this.tweetRepository = tweetRepository;
        this.userRepository = userRepository;
    }

    @RequestMapping(value = "/fetch/tweet/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Tweet fetchTweetById(@PathVariable("tweetid") int tweetid) throws IOException {
        return tweetRepository.findTweetByTweetId(tweetid);
    }

    @RequestMapping(value = "/search/tweets", method = RequestMethod.GET)
    @ResponseBody
    public List<Tweet> searchTweet(@RequestParam("keyword") String keyword, @RequestParam("offset") int offset,
                                   @RequestParam("limit") int limit) throws
            IOException {
        return tweetRepository.searchTweet(keyword, offset, limit);
    }

    @RequestMapping(value = "/post/tweet", method = RequestMethod.OPTIONS)
    @ResponseBody
    public void getOptions(){
    }

    @RequestMapping(value = "/post/tweet", method = RequestMethod.POST)
    @ResponseBody
    public Tweet createTweet(@RequestBody final Tweet tweet, HttpServletResponse response, HttpServletRequest request){
        int id = tweetRepository.createTweet(HtmlUtils.htmlEscape(tweet.getContent()),
                Integer.parseInt(request.getHeader("userid")));
        if (id != -1){
            response.setStatus(200);
            return tweetRepository.findTweetByTweetId(id);
        }
        response.setStatus(403);
        return null;
    }

    @RequestMapping(value = "/fetch/posts/{userid}", method = RequestMethod.GET)
    @ResponseBody
    public List<Tweet> fetchPosts(@PathVariable("userid") int userid, @RequestParam("offset") int offset, HttpServletResponse response){
        return tweetRepository.findTweetsByUserId(userid, offset, 5);
    }

    @RequestMapping(value = "/fetch/feed", method = RequestMethod.OPTIONS)
    @ResponseBody
    public void getFeedOptions() {
    }

    @RequestMapping(value = "/fetch/feed", method = RequestMethod.GET)
    @ResponseBody
    public List<Tweet> fetchFeed(HttpServletRequest request, @RequestParam("lastTweet") int lastTweet,
                                 @RequestParam("limit") int limit){
        int userid = Integer.parseInt(request.getHeader("userid"));
        return tweetRepository.fetchFeed(userid, lastTweet, limit);
    }

    @RequestMapping(value = "/fetch/feed/latest", method = RequestMethod.OPTIONS)
    @ResponseBody
    public void getNewFeedOptions() {
    }

    @RequestMapping(value = "/fetch/feed/latest", method = RequestMethod.GET)
    @ResponseBody
    public List<Tweet> fetchNewFeed(HttpServletRequest request, @RequestParam("tweetid") int tweetid){
        int userid = Integer.parseInt(request.getHeader("userid"));
        return tweetRepository.fetchNewFeed(userid, tweetid);
    }
}
