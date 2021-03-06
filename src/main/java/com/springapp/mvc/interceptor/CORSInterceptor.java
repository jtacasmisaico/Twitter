package com.springapp.mvc.interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 28/7/13
 * Time: 7:36 PM
 */
@Component
public class CORSInterceptor extends HandlerInterceptorAdapter{
    @Override
    public boolean preHandle( HttpServletRequest request, HttpServletResponse response,
                              Object handler) {
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, token, userid");
        response.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
        return true;
    }
}
