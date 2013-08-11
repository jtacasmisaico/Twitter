package com.springapp.mvc.web;

import com.springapp.mvc.data.AuthenticationRepository;
import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.AuthenticatedUser;
import com.springapp.mvc.model.User;
import com.springapp.mvc.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
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
    private final LoginService loginService;
    @Autowired
    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @RequestMapping(value = "/users/login", method = RequestMethod.OPTIONS)
    public void getLoginOptions(HttpServletResponse response) {
        response.addHeader("Access-Control-Allow-Origin", "https://localhost");
        response.addHeader("Access-Control-Allow-Credentials", "true");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type");
        response.addHeader("Access-Control-Allow-Methods", "OPTIONS, POST");
    }

    @RequestMapping(value = "/users/login", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> login(HttpServletResponse response, @RequestBody Map<String,
            Object> requestParameters) throws InvalidKeySpecException, NoSuchAlgorithmException {
        response.addHeader("Access-Control-Allow-Origin", "https://localhost");
        response.addHeader("Access-Control-Allow-Credentials", "true");
        return loginService.login((String) requestParameters.get("email"), (String) requestParameters.get("password"),
                response);
    }

    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public String logout(HttpServletRequest request) {
        return "Success";
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public void printWelcome(HttpServletResponse response) throws IOException {
        response.sendRedirect("https://localhost/twitter");
    }
}