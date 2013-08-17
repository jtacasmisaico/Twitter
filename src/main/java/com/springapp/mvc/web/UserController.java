package com.springapp.mvc.web;

import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.User;
import com.springapp.mvc.service.UserService;
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
    private final UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "/users/", method = RequestMethod.GET)
    @ResponseBody
    public User fetchUser(@RequestParam("id") int userid) throws IOException {
        return userService.findById(userid);
    }

    @RequestMapping(value = "/users/{username}", method = RequestMethod.GET)
    @ResponseBody
    public User fetchUserByUsername(@PathVariable("username") String username, HttpServletResponse response) throws
            IOException {
        return userService.findByUsername(username, response);
    }


    @RequestMapping(value = "/users/followers/{id}", method = RequestMethod.GET)
    @ResponseBody
    public List<User> fetchFollowers(@PathVariable("id") int userid, @RequestParam("offset") int offset,
        @RequestParam("limit") int limit) throws IOException {
        return userService.fetchFollowers(userid, offset, limit);
    }

    @RequestMapping(value = "/users/fetch/all", method = RequestMethod.GET)
    @ResponseBody
    public List<String> fetchAllUsers() throws IOException {
        return userService.getAllUsers();
    }

    @RequestMapping(value = "/users/follows/{id}", method = RequestMethod.GET)
    @ResponseBody
    public List<User> fetchFollows(@PathVariable("id") int userid, @RequestParam("offset") int offset,
    @RequestParam("limit") int limit) throws IOException {
        return userService.fetchFollows(userid, offset, limit);
    }

    @RequestMapping(value = "/users/follows/count/{id}", method = RequestMethod.GET)
    @ResponseBody
    public int countFollows(@PathVariable("id") int userid) throws IOException {
        return userService.findFollowingCount(userid);
    }

    @RequestMapping(value = "/users/followers/count/{id}", method = RequestMethod.GET)
    @ResponseBody
    public int countFollowers(@PathVariable("id") int userid) throws IOException {
        return userService.findFollowersCount(userid);
    }

    @RequestMapping(value = "/users/check/follows/", method = RequestMethod.GET)
    @ResponseBody
    public boolean checkFollows(@RequestParam("follower") int follower, @RequestParam("followed") int followed) throws
            IOException {
        return userService.checkFollows(follower, followed);
    }

    @RequestMapping(value = "/users/follow", method = RequestMethod.OPTIONS)
    @ResponseBody
    public void getOptionsFollow(){
    }
    @RequestMapping(value = "/users/follow", method = RequestMethod.POST)
    @ResponseBody
    public String follow(@RequestBody Map<String,Object> requestParameters, HttpServletRequest request) throws
            IOException {
        return userService.follow(request, (int) requestParameters.get("followed"));
    }

    @RequestMapping(value = "/users/unfollow", method = RequestMethod.OPTIONS)
    @ResponseBody
    public void getOptionsUnFollow(){
    }
    @RequestMapping(value = "/users/unfollow", method = RequestMethod.POST)
    @ResponseBody
    public String unfollow(@RequestBody Map<String,Object> requestParameters,
                           HttpServletRequest request) throws IOException {
        return userService.unfollow(request, (int) requestParameters.get("followed"));
    }

    @RequestMapping(value = "/users/image/create", method = RequestMethod.OPTIONS)
    @ResponseBody
    public void getImageCreateOptions(){
    }
    @RequestMapping(value = "/users/image/create", method = RequestMethod.POST)
    @ResponseBody
    public String createImage(@RequestBody Map<String,Object> requestParameters,
                              HttpServletRequest request) throws IOException {
        return userService.createImage((String) requestParameters.get("image"), request);
    }

    @RequestMapping(value = "/users/register", method = RequestMethod.OPTIONS)
    @ResponseBody
    public void getOptionsCreateUser() {
    }

    @RequestMapping(value = "/users/register", method = RequestMethod.POST)
    @ResponseBody
    public String createUser(HttpServletResponse response, @RequestBody final User user) throws InvalidKeySpecException, NoSuchAlgorithmException {
        return userService.createUser(response, user);
    }

    @RequestMapping(value = "/search/users", method = RequestMethod.GET)
    @ResponseBody
    public List<String> searchTweet(@RequestParam("term") String username) throws
            IOException {
        return userService.searchUsers(username);
    }
}