package com.springapp.mvc.web;

import com.springapp.mvc.data.TweetRepository;
import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.Tweet;
import com.springapp.mvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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
    public Tweet fetchUser(@PathVariable("tweetid") int tweetid) throws IOException {
        return tweetRepository.findTweetByTweetId(tweetid);
    }

    @RequestMapping(value = "/post/tweet", method = RequestMethod.OPTIONS)
    @ResponseBody
    public void getOptions(){
    }

    @RequestMapping(value = "/post/tweet", method = RequestMethod.POST)
    @ResponseBody
    public Tweet createTweet(@RequestBody final Tweet tweet, HttpServletResponse response, HttpServletRequest request){
        int id = tweetRepository.createTweet(tweet.getContent(), Integer.parseInt(request.getHeader("userid")),
                userRepository.findById(Integer.parseInt(request.getHeader("userid"))).getUsername());
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
        response.addHeader("Access-Control-Allow-Origin", "*");
        return tweetRepository.findTweetsByUserId(userid, offset, 5);
    }

    @RequestMapping(value = "/fetch/feed", method = RequestMethod.OPTIONS)
    @ResponseBody
    public void getOptionsForFetchFeed(){
    }
    @RequestMapping(value = "/fetch/feed", method = RequestMethod.GET)
    @ResponseBody
    public List<Tweet> fetchFeed(HttpServletRequest request, @RequestParam("offset") int offset){
        int userid = Integer.parseInt(request.getHeader("userid"));
        System.out.println(userid+" : "+offset);
        return tweetRepository.fetchFeed(userid, offset, 10);
    }
}
