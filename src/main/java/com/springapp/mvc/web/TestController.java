package com.springapp.mvc.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 10/7/13
 * Time: 6:01 PM
 * To change this template use File | Settings | File Templates.
 */

@Controller
@RequestMapping("/test")
public class TestController implements AuthenticatedController{
        @RequestMapping(method = RequestMethod.GET)
        public String printWelcome(ModelMap model) {
            model.addAttribute("content", "Logged In!");
            return "test";
        }
}
