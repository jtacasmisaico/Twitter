package com.springapp.mvc.web;

import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 15/7/13
 * Time: 2:28 PM
 */
@Controller
public class LoginController implements AuthenticatedController{
    private final UserRepository repository;
    @Autowired
    public LoginController(UserRepository repository) {
        this.repository = repository;
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public String login(HttpSession session, @RequestParam("email") String email, @RequestParam("password") String password){
        User user = repository.findByEmail(email);
        if(user == null) return "No Such User";
        System.out.println(password+" : "+user.getPassword());
        if(password.equals(user.getPassword())) {
            session.setAttribute("loggedIn","true");
            return "Success";
        }
        else return "Error";
    }

    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public String logout(HttpServletRequest request) {
        HttpSession httpSession;
        httpSession = request.getSession(false);
        httpSession.invalidate();
        return "Success";

    }
}