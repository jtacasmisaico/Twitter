package com.springapp.mvc.web;

import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
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
        response.addHeader("Access-Control-Allow-Origin", "*");
        return repository.findByUsername(username);
    }

    @RequestMapping(value = "/users/{id}/followers", method = RequestMethod.GET)
    @ResponseBody
    public List<User> fetchFollowers(HttpServletResponse response, @PathVariable("id") int userid) throws IOException {
        response.addHeader("Access-Control-Allow-Origin", "*");
        return repository.fetchFollowers(userid);
    }

    @RequestMapping(value = "/users/{id}/follows", method = RequestMethod.GET)
    @ResponseBody
    public List<User> fetchFollows(HttpServletResponse response, @PathVariable("id") int userid) throws IOException {
        response.addHeader("Access-Control-Allow-Origin", "*");
        return repository.fetchFollows(userid);
    }

    @RequestMapping(value = "/users/follow", method = RequestMethod.POST)
    @ResponseBody
    public String follow(HttpServletResponse response,@RequestBody Map<String,Object> requestParameters) throws IOException {
        response.addHeader("Access-Control-Allow-Origin", "*");
        return repository.follow((int)requestParameters.get("follower"), (int)requestParameters.get("followed"));
    }

    @RequestMapping(value = "/users/unfollow", method = RequestMethod.POST)
    @ResponseBody
    public String unfollow(HttpServletResponse response,@RequestBody Map<String,Object> requestParameters) throws IOException {
        response.addHeader("Access-Control-Allow-Origin", "*");
        return repository.unfollow((int)requestParameters.get("follower"), (int)requestParameters.get("followed"));
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ResponseBody
    public String createUser(@RequestBody final User user){
        System.out.println(user.getName());
        int id = repository.createUser(user.getUsername(), user.getName(), user.getEmail(), user.getPassword());
        if (id != -1){
            return "Success";
        }
        return "Fail";
    }
}