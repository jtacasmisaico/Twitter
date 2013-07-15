package com.springapp.mvc.web;

import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.User;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 11/7/13
 * Time: 2:39 PM
 * To change this template use File | Settings | File Templates.
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
    public String fetchUser(@PathVariable("id") Long id) throws IOException {
        User user = repository.findById(id);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(user);
    }

    @RequestMapping(value = "/users", method = RequestMethod.POST, headers={"Accept=application/json"})
    @ResponseBody
    public String createUser(@RequestBody final User user, HttpServletResponse response){
        long id = repository.createUser(user.getUsername(), user.getPassword(), user.getEmail(), user.getName());
        if (id != -1){
            response.setStatus(201);
            response.setHeader("Location", "http://localhost:8080/users/"+ id);
        } else {
            response.setStatus(409);
        }
        return "";
    }
}
