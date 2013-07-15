package com.springapp.mvc.web;

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
    @Override
    public boolean preHandle( HttpServletRequest request, HttpServletResponse response,
                              Object handler ) throws Exception {
        System.out.println("Intercepting...");
        return true;

//        if ( !( handler instanceof AuthenticatedController ) ) {
//            System.out.println("Not instance");
//            return true;
//        }
//        boolean isAuthenticated = false; // Check here
//        if ( !isAuthenticated ) {
//            System.out.println("Not authenticated");
//            response.setStatus( HttpServletResponse.SC_FORBIDDEN );
//            return false;
//        }
//        return true;
    }
}
