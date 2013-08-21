package com.springapp.mvc.web;

import com.springapp.mvc.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 15/7/13
 * Time: 2:28 PM
 */
@Controller
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @RequestMapping(value = "/users/login", method = RequestMethod.OPTIONS)
    public void getLoginOptions(HttpServletRequest request, HttpServletResponse response) {
        response.addHeader("Access-Control-Allow-Origin", request.getHeader("origin"));
        response.addHeader("Access-Control-Allow-Credentials", "true");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type");
        response.addHeader("Access-Control-Allow-Methods", "OPTIONS, POST");
    }

    @RequestMapping(value = "/users/login", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> login(HttpServletRequest request, HttpServletResponse response, @RequestBody Map<String,
            Object> requestParameters) throws InvalidKeySpecException, NoSuchAlgorithmException {
        response.addHeader("Access-Control-Allow-Origin", request.getHeader("origin"));
        response.addHeader("Access-Control-Allow-Credentials", "true");
        return authenticationService.login((String) requestParameters.get("email"), (String) requestParameters.get("password"),
                response);
    }

    @RequestMapping(value = "/users/logout", method = RequestMethod.OPTIONS)
    public void getLogoutOptions() {
    }
    @RequestMapping(value = "/users/logout", method = RequestMethod.POST)
    @ResponseBody
    public void logout(HttpServletRequest request) {
        try {
            authenticationService.logout(request.getHeader("token"), Integer.parseInt(request.getHeader("userid")));
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/oauth/getRequestToken", method = RequestMethod.GET)
    @ResponseBody
    public String getRequestToken(HttpServletRequest request) {
        return "/oauth/authorizeToken/"+authenticationService.insertToken(request.getHeader("consumerid"));
    }

    @RequestMapping(value = "/oauth/authorizeToken/{token}", method = RequestMethod.GET)
    public String oauthLogin(ModelMap model, @PathVariable("token") String token) {
        model.addAttribute("token", token);
        return "login";
    }

    @RequestMapping(value = "/oauth/authorize", method = RequestMethod.POST)
    @ResponseBody
    public String oauthAuthorize(@RequestParam("token") String token, @RequestParam("email") String email,
                                 @RequestParam("password") String password) {
        System.out.println("Entered Authorizer");
        return authenticationService.authorizeRequestToken(token, email, password);
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public void printWelcome(HttpServletResponse response) throws IOException {
        response.sendRedirect("https://localhost/twitter");
    }
}