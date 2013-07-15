package com.springapp.mvc.model;

public class User {


    public Long userid;
    public String username;
    public String password;
    public String name;

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public String email;

    public void setName(String name) {
        this.name = name;
    }

    public void setUserid(Long userid) {

        this.userid = userid;
    }

    public Long getUserid() {

        return userid;
    }

    public String getName() {
        return name;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }
}
