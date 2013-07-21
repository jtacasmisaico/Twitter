package com.springapp.mvc.web;

import com.springapp.mvc.data.TweetRepository;
import com.springapp.mvc.model.Tweet;
import org.codehaus.jackson.map.ObjectMapper;
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
    private final TweetRepository repository;
    @Autowired
    public TweetController(TweetRepository repository) {
        this.repository = repository;
    }

    @RequestMapping(value = "/tweet/{id}", method = RequestMethod.GET)
    @ResponseBody
    public String fetchUser(@PathVariable("id") Long id) throws IOException {
        Tweet tweet = repository.findByTweetId(id);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(tweet);
    }

    @RequestMapping(value = "/tweet", method = RequestMethod.POST)
    @ResponseBody
    public String createTweet(@RequestBody final Tweet tweet){
        System.out.println("Creating Tweet...");
        int id = repository.createTweet(tweet.getContent(), tweet.getUserid());
        if (id != -1){
            return "Success";
        }
        return "Fail";
    }

    @RequestMapping(value = "/feed", method = RequestMethod.POST)
    @ResponseBody
    public List<Tweet> fetchFeed(@RequestBody Map<String,Object> requestParameters){
        int userid = (int) requestParameters.get("userid");
        return repository.findByUserId(userid);
    }
}
