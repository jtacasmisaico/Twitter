package com.springapp.mvc.web;

import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.HtmlUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 11/7/13
 * Time: 2:39 PM
 */
@Controller
public class UserController {
    private final UserRepository repository;
    @Autowired
    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    @RequestMapping(value = "/users/", method = RequestMethod.GET)
    @ResponseBody
    public User fetchUser(@RequestParam("id") int id) throws IOException {
        return repository.findById(id);
    }

    @RequestMapping(value = "/users/{username}", method = RequestMethod.GET)
    @ResponseBody
    public User fetchUserByUsername(HttpServletResponse response, @PathVariable("username") String username) throws
            IOException {
        response.setHeader("Access-Control-Allow-Origin", "https://localhost");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return repository.findByUsername(username);
    }


    @RequestMapping(value = "/users/followers/{id}", method = RequestMethod.GET)
    @ResponseBody
    public List<User> fetchFollowers(@PathVariable("id") int userid, @RequestParam("offset") int offset,
        @RequestParam("limit") int limit) throws IOException {
        return repository.fetchFollowers(userid, offset, limit);
    }

    @RequestMapping(value = "/users/follows/{id}", method = RequestMethod.GET)
    @ResponseBody
    public List<User> fetchFollows(@PathVariable("id") int userid, @RequestParam("offset") int offset,
    @RequestParam("limit") int limit) throws IOException {
        return repository.fetchFollows(userid, offset, limit);
    }

    @RequestMapping(value = "/users/follows/count/{id}", method = RequestMethod.GET)
    @ResponseBody
    public int countFollows(@PathVariable("id") int userid) throws IOException {
        return repository.findFollowingCount(userid);
    }

    @RequestMapping(value = "/users/followers/count/{id}", method = RequestMethod.GET)
    @ResponseBody
    public int countFollowers(@PathVariable("id") int userid) throws IOException {
        return repository.findFollowersCount(userid);
    }

    @RequestMapping(value = "/users/check/follows/", method = RequestMethod.GET)
    @ResponseBody
    public boolean checkFollows(@RequestParam("follower") int follower, @RequestParam("followed") int followed) throws
            IOException {
        return repository.checkFollows(follower, followed);
    }

    @RequestMapping(value = "/users/follow", method = RequestMethod.OPTIONS)
    @ResponseBody
    public void getOptionsFollow(){
    }
    @RequestMapping(value = "/users/follow", method = RequestMethod.POST)
    @ResponseBody
    public String follow(@RequestBody Map<String,Object> requestParameters) throws IOException {
        return repository.follow((int)requestParameters.get("follower"), (int)requestParameters.get("followed"));
    }

    @RequestMapping(value = "/users/unfollow", method = RequestMethod.OPTIONS)
    @ResponseBody
    public void getOptionsUnFollow(){
    }
    @RequestMapping(value = "/users/unfollow", method = RequestMethod.POST)
    @ResponseBody
    public String unfollow(@RequestBody Map<String,Object> requestParameters) throws IOException {
        return repository.unfollow((int)requestParameters.get("follower"), (int)requestParameters.get("followed"));
    }

    @RequestMapping(value = "/users/image/create", method = RequestMethod.OPTIONS)
    @ResponseBody
    public void getImageCreateOptions(){
    }
    @RequestMapping(value = "/users/image/create", method = RequestMethod.POST)
    @ResponseBody
    public String createImage(@RequestBody Map<String,Object> requestParameters,
                              HttpServletRequest request) throws IOException {
        return repository.createImage((String) requestParameters.get("image"), Integer.parseInt(request.getHeader("userid")));
    }

    @RequestMapping(value = "/users/register", method = RequestMethod.OPTIONS)
    @ResponseBody
    public void getOptionsCreateUser() {
    }

    @RequestMapping(value = "/users/register", method = RequestMethod.POST)
    @ResponseBody
    public String createUser(HttpServletResponse response, @RequestBody final User user) throws InvalidKeySpecException, NoSuchAlgorithmException {
        return repository.createUser(response, HtmlUtils.htmlEscape(user.getUsername()),
                HtmlUtils.htmlEscape(user.getName()), HtmlUtils.htmlEscape(user.getEmail()),
                HtmlUtils.htmlEscape(user.getPassword()));

    }

    @RequestMapping(value = "/search/users", method = RequestMethod.GET)
    @ResponseBody
    public List<String> searchTweet(@RequestParam("term") String username) throws
            IOException {
        return repository.searchUsers(username.substring(1));
    }
}