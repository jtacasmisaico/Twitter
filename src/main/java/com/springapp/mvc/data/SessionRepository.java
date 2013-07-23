package com.springapp.mvc.data;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 22/7/13
 * Time: 6:25 PM
 */
@Repository
public class SessionRepository {
    private static ArrayList<String> sessions = new ArrayList<> ();

    public static void addSession(String sessionId) {
        sessions.add(sessionId);
    }

    public static void endSession(String sessionId) {
        sessions.remove(sessionId);
    }

    public static void printSessionIds() {
        for(int i=0; i<sessions.size(); i++)
            System.out.println(sessions.get(i));
    }

    public static boolean isValidSession(String sessionId) {
        if(sessions.contains(sessionId)) return true;
        else return false;
    }
}
