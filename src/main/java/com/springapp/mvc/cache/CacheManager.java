package com.springapp.mvc.cache;

import com.google.gson.Gson;
import com.springapp.mvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 18/8/13
 * Time: 1:45 PM
 */
@Service
public class CacheManager {
    @Autowired
    Jedis cache;
    Gson gson = new Gson();

    public void set(String key, Object value) {
        try {
            cache.set(key, gson.toJson(value));
            cache.expire(key, 60*60);
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }

    public Object get(String key, Class classType) {
        try {
            return gson.fromJson(cache.get(key), classType);
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public void delete(String key) {
        try{
            cache.del(key);
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }

    public boolean exists(String key) {
        try {
            return cache.exists(key);
        }
        catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
