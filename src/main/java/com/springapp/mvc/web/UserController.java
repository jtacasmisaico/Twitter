package com.springapp.mvc.web;

import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.User;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;

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

    @RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
    @ResponseBody
    public User fetchUser(@PathVariable("id") int id) throws IOException {
        return repository.findById(id);
    }

    @RequestMapping(value = "/users/{id}/followers", method = RequestMethod.GET)
    @ResponseBody
    public List<User> fetchFollowers(@PathVariable("id") int userid) throws IOException {
        return repository.fetchFollowers(userid);
    }

    @RequestMapping(value = "/users/{id}/follows", method = RequestMethod.GET)
    @ResponseBody
    public List<User> fetchFollows(@PathVariable("id") int userid) throws IOException {
        return repository.fetchFollows(userid);
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
