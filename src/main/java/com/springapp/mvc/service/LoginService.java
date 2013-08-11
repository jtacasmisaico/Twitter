package com.springapp.mvc.service;

import com.springapp.mvc.data.AuthenticationRepository;
import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.AuthenticatedUser;
import com.springapp.mvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 11/8/13
 * Time: 10:08 AM
 */
@Service
public class LoginService {
    private final UserRepository userRepository;
    private final AuthenticationRepository authenticationRepository;
    private SecureRandom random = new SecureRandom();

    @Autowired
    public LoginService(UserRepository userRepository, AuthenticationRepository authenticationRepository) {
        this.userRepository = userRepository;
        this.authenticationRepository = authenticationRepository;
    }

    public Map<String, Object> login(String email, String password, HttpServletResponse response) {
        User user = userRepository.findByEmail(email);
        if(user == null) {
            response.setStatus(403);
            return null;
        }
        try {
            if(authenticationRepository.validatePassword(password, user.getPassword())) {
                String sessionid = new BigInteger(130, random).toString(32);
                AuthenticatedUser session = new AuthenticatedUser(sessionid, user.getUserid());
                User authenticatedUser = userRepository.findById(user.getUserid());
                Map<String, Object> sessionMap = new HashMap<>();
                sessionMap.put("sessionid", sessionid);
                sessionMap.put("user", authenticatedUser);
                authenticationRepository.addSession(session);
                response.setStatus(200);
                return sessionMap;
            }
            else {
                response.setStatus(403);
                return null;
            }
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        }
        return null;
    }

}
