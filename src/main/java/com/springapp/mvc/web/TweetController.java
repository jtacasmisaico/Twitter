package com.springapp.mvc.web;

import com.springapp.mvc.data.TweetRepository;
import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.Tweet;
import com.springapp.mvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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

    @Autowired
    public TweetController(TweetRepository tweetRepository) {
        this.tweetRepository = tweetRepository;
    }

    @RequestMapping(value = "/tweet/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Tweet fetchUser(@PathVariable("id") Long id) throws IOException {
        return tweetRepository.findTweetByTweetId(id);
    }

    @RequestMapping(value = "/tweet", method = RequestMethod.POST)
    @ResponseBody
    public String createTweet(@RequestBody final Tweet tweet){
        int id = tweetRepository.createTweet(tweet.getContent(), tweet.getUserid());
        if (id != -1){
            return "Success";
        }
        return "Fail";
    }

    @RequestMapping(value = "/posts", method = RequestMethod.POST)
    @ResponseBody
    public List<Tweet> fetchPosts(@RequestBody Map<String,Object> requestParameters){
        int userid = (int) requestParameters.get("userid");
        return tweetRepository.findTweetsByUserId(userid);
    }

    @RequestMapping(value = "/feed", method = RequestMethod.POST)
    @ResponseBody
    public List<Tweet> fetchFeed(@RequestBody Map<String,Object> requestParameters){
        int userid = (int) requestParameters.get("userid");
        return tweetRepository.fetchFeed(userid);
    }
}
