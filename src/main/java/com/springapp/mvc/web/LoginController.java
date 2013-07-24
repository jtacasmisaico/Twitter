package com.springapp.mvc.web;

import com.springapp.mvc.data.SessionRepository;
import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.Session;
import com.springapp.mvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 15/7/13
 * Time: 2:28 PM
 */
@Controller
public class LoginController{
    private final UserRepository repository;
    private SecureRandom random = new SecureRandom();
    @Autowired
    public LoginController(UserRepository repository) {
        this.repository = repository;
    }

    @RequestMapping(value = "/login", method = RequestMethod.OPTIONS)
    public void getOptions(HttpServletResponse response) {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type");
        response.addHeader("Access-Control-Allow-Methods", "OPTIONS, POST");
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> login(HttpServletResponse response, @RequestBody Map<String,
            Object> requestParameters){
        response.addHeader("Access-Control-Allow-Origin", "*");
        String email = (String) requestParameters.get("email");
        String password = (String) requestParameters.get("password");
        User user = repository.findByEmail(email);
        if(user == null) {
            response.setStatus(403);
            return null;
        }
        if(password.equals(user.getPassword())) {
            String sessionid = new BigInteger(130, random).toString(32);
            Session session = new Session(sessionid, user.getUserid());
            User authenticatedUser = repository.findById(user.getUserid());
            Map<String, Object> sessionMap = new HashMap<>();
            sessionMap.put("sessionid", sessionid);
            sessionMap.put("user", authenticatedUser);
            SessionRepository.addSession(session);
            SessionRepository.printSessionIds();
            response.setStatus(200);
            return sessionMap;
        }
        else {
            response.setStatus(403);
            return null;
        }
    }

    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public String logout(HttpServletRequest request) {
        HttpSession httpSession;
        httpSession = request.getSession(false);
        httpSession.invalidate();
        return "Success";

    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public void printWelcome(HttpServletResponse response) throws IOException {
        response.sendRedirect("http://localhost/twitter");
    }
}