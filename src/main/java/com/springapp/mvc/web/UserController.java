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
        response.setHeader("Access-Control-Allow-Origin", "https://localhost");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return repository.findByUsername(username);
    }

    @RequestMapping(value = "/users/followers/{id}", method = RequestMethod.GET)
    @ResponseBody
    public List<User> fetchFollowers(HttpServletResponse response, @PathVariable("id") int userid) throws IOException {
        return repository.fetchFollowers(userid);
    }

    @RequestMapping(value = "/users/follows/{id}", method = RequestMethod.GET)
    @ResponseBody
    public List<User> fetchFollows(HttpServletResponse response, @PathVariable("id") int userid) throws IOException {
        return repository.fetchFollows(userid);
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

    @RequestMapping(value = "/users/register", method = RequestMethod.OPTIONS)
    @ResponseBody
    public void getOptionsCreateUser(HttpServletResponse response) {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type");
        response.addHeader("Access-Control-Allow-Methods", "OPTIONS, POST");
    }

    @RequestMapping(value = "/users/register", method = RequestMethod.POST)
    @ResponseBody
    public String createUser(HttpServletResponse response, @RequestBody final User user){
        response.addHeader("Access-Control-Allow-Origin", "*");
        return repository.createUser(response, user.getUsername(), user.getName(), user.getEmail(),
                user.getPassword());

    }
}