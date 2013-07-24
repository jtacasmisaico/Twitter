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
    private int userid;

    public Session(String sessionid, int userid) {
        this.sessionid = sessionid;
        this.userid = userid;
    }

    public String getSessionid() {
        return sessionid;
    }

    public int getUserid() {
        return userid;
    }

    public void setSessionid(String sessionid) {
        this.sessionid = sessionid;
    }

    public void setUserid(int userid) {
        this.userid = userid;
    }
}
