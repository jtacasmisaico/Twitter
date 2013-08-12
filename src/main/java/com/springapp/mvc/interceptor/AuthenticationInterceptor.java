package com.springapp.mvc.interceptor;

import com.springapp.mvc.data.AuthenticationRepository;
import com.springapp.mvc.model.AuthenticatedUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 12/7/13
 * Time: 4:39 PM
 */
@Component
public class AuthenticationInterceptor extends HandlerInterceptorAdapter {
    @Autowired private AuthenticationRepository authenticationRepository;


    @Override
    public boolean preHandle( HttpServletRequest request, HttpServletResponse response,
                              Object handler) {
        response.addHeader("Access-Control-Allow-Origin", "https://localhost");
        response.addHeader("Access-Control-Allow-Credentials", "true");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type, token, userid");
        response.addHeader("Access-Control-Allow-Methods", "OPTIONS, POST");
        if(!"OPTIONS".equals(request.getMethod())) {
            AuthenticatedUser authenticatedUser = new AuthenticatedUser(request.getHeader("token"), Integer.parseInt(request.getHeader("userid")));
            if(authenticationRepository.isValidSession(authenticatedUser)){
                return true;
            }
            else {
                response.setStatus(403);
                return false;
            }
        }
        return true;
    }
}
