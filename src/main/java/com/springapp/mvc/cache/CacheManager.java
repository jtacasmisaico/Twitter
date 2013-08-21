package com.springapp.mvc.cache;

import com.google.gson.Gson;
import com.springapp.mvc.model.Tweet;
import com.springapp.mvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 18/8/13
 * Time: 1:45 PM
 */
@Service
public class CacheManager {
    @Autowired
    JedisPool cachedResource;
    Gson gson = new Gson();

    public void set(String key, Object value) {
        try {
            Jedis cache = cachedResource.getResource();
            cache.set(key, gson.toJson(value));
            cache.expire(key, 60*60);
            cachedResource.returnResource(cache);
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }

    public void set(String key, Object value, int expiry) {
        try {
            Jedis cache = cachedResource.getResource();
            cache.set(key, gson.toJson(value));
            cache.expire(key, expiry);
            cachedResource.returnResource(cache);
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }


    public Object get(String key, Class classType) {
        try {
            Jedis cache = cachedResource.getResource();
            System.out.println("Hit Cache : "+key);
            Object value = gson.fromJson(cache.get(key), classType);
            cachedResource.returnResource(cache);
            return value;
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public int getInt(String key) {
        try {
            Jedis cache = cachedResource.getResource();
            System.out.println("Hit Cache : "+key);
            int value = gson.fromJson(cache.get(key), int.class);
            cachedResource.returnResource(cache);
            return value;
        }
        catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    public Tweet[] getTweetList(String key) {
        try {
            Jedis cache = cachedResource.getResource();
            System.out.println("Hit Cache : "+key);
            Tweet[] value = gson.fromJson(cache.get(key), Tweet[].class);
            cachedResource.returnResource(cache);
            return value;
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String[] getStringList(String key) {
        try {
            Jedis cache = cachedResource.getResource();
            System.out.println("Hit Cache : "+key);
            String[] value = gson.fromJson(cache.get(key), String[].class);
            cachedResource.returnResource(cache);
            return value;
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public void delete(String key) {
        try{
            Jedis cache = cachedResource.getResource();
            cache.del(key);
            cachedResource.returnResource(cache);
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }

    public boolean exists(String key) {
        try {
            Jedis cache = cachedResource.getResource();
            boolean value = cache.exists(key);
            cachedResource.returnResource(cache);
            return value;
        }
        catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


}
