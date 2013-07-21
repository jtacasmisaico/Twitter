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
    public String fetchUser(@PathVariable("id") int id) throws IOException {
        User user = repository.findById(id);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(user);
    }

    @RequestMapping(value = "/users/{id}/followers", method = RequestMethod.GET)
    @ResponseBody
    public String fetchFollowers(@PathVariable("id") int userid) throws IOException {
        List<User> user = repository.fetchFollowers(userid);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(user);
    }


    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ResponseBody
    public String CreateUser(@RequestBody final User user){
        System.out.println(user.getName());
        long id = repository.createUser(user.getUsername(), user.getName(), user.getEmail(), user.getPassword());
        if (id != -1){
            return "Success";
        }
        return "Fail";
    }
}
