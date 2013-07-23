package com.springapp.mvc.model;

import org.codehaus.jackson.map.annotate.JsonSerialize;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 23/7/13
 * Time: 1:06 PM
 */
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class Session {
    private String sessionid;
    private User user;

    public Session(String sessionid, User user) {
        this.sessionid = sessionid;
        this.user = user;
    }

    public String getSessionid() {
        return sessionid;
    }

    public User getUser() {
        return user;
    }

    public void setSessionid(String sessionid) {
        this.sessionid = sessionid;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
