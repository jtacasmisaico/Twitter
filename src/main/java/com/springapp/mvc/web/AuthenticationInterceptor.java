package com.springapp.mvc.web;

import com.springapp.mvc.data.SessionRepository;
import com.springapp.mvc.model.Session;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 12/7/13
 * Time: 4:39 PM
 */
@Component
public class AuthenticationInterceptor extends HandlerInterceptorAdapter {
    @Override
    public boolean preHandle( HttpServletRequest request, HttpServletResponse response,
                              Object handler) {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type, token, userid");
        response.addHeader("Access-Control-Allow-Methods", "OPTIONS, POST");
        System.out.println("Interceptor Request Received : "+request.getMethod());
        if("POST".equals(request.getMethod())) {
            System.out.println(request.getHeader("token"));
            Session session = new Session(request.getHeader("token"), Integer.parseInt(request.getHeader("userid")));
            if(SessionRepository.isValidSession(session))
                return true;
            else {
                response.setStatus(403);
                return false;
            }
        }
        return true;
    }
}
