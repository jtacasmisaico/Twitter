package com.springapp.mvc.service;

import com.springapp.mvc.cache.CacheManager;
import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 11/8/13
 * Time: 9:22 AM
 */
@Service
public class UserService {
    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;
    private final CacheManager cacheManager;
    private Trie userNames;

    public class TrieNode
    {
        char letter;
        HashMap map;
        boolean fullWord;

        TrieNode(char letter, boolean fullWord)
        {
            this.letter = letter;
            map = new HashMap<Character,TrieNode>();
            this.fullWord = fullWord;
        }
    }
    public class Trie
    {
        TrieNode root;

        public Trie() {
            this.root = new TrieNode('\0', false);
        }


        public void insertWord(TrieNode root, String word)
        {
            int l = word.length();
            char[] letters = word.toCharArray();
            TrieNode curNode = root;

            for (int i = 0; i < l; i++)
            {
                if (curNode.map.containsKey(letters[i]) == false)
                    curNode.map.put(letters[i],new TrieNode(letters[i], i == l-1 ? true : false));
                curNode = (TrieNode) curNode.map.get(letters[i]);
            }
        }

        public TrieNode getPrefixNode(String word, StringBuilder testword) {
            TrieNode cur = root;
            int i=0;
            while ( i < word.length()){
                if (cur.map.get(word.charAt(i)) == null)
                    return cur;    // only a strict prefix exists which is a path
                else
                    cur = (TrieNode) cur.map.get(word.charAt(i));
                testword.append(word.charAt(i));
                i++;
            }
            return cur;
        }

        public ArrayList<String> getAllPrefixMatches(String prefix)
        {
            StringBuilder testword = new StringBuilder();
            TrieNode node = getPrefixNode(prefix, testword);
            ArrayList<String> stringList = new ArrayList<String>();
            if (testword.length() == prefix.length())
                preOrderTraverse(node,stringList,prefix);

            return stringList;
        }



        public void preOrderTraverse(TrieNode node, ArrayList<String> list, String word){
            if ( node.fullWord ){
                list.add(word);
            }
            Iterator entries = node.map.entrySet().iterator();
            while (entries.hasNext()) {
                Map.Entry entry = (Map.Entry) entries.next();
                Character key = (Character) entry.getKey();

                TrieNode value = (TrieNode) entry.getValue();
                preOrderTraverse(value, list, word+key);

            }
        }
    }



    @Autowired
    public UserService(UserRepository userRepository, AuthenticationService authenticationService, CacheManager cacheManager) {
        this.userRepository = userRepository;
        this.authenticationService = authenticationService;
        this.cacheManager = cacheManager;
        instantiateAutoComplete();
    }

    public void instantiateAutoComplete() {
        userNames = new Trie();
        List<String> usernames;
        if(cacheManager.exists("userlist")) usernames = Arrays.asList(cacheManager.getStringList("userlist"));
        else {
            usernames = userRepository.getAllUsers();
            cacheManager.set("userlist", usernames, 3000000);
        }
        for(String username : usernames) {
            try {
                userNames.insertWord(userNames.root, username);
            }
            catch(Exception e) {
                e.printStackTrace();
                continue;
            }
        }
    }

    public User findById(int userid) {
        return userRepository.findById(userid);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<User> fetchFollowers(int userid, int offset, int limit) {
        return userRepository.fetchFollowers(userid, offset, limit);
    }

    public List<User> fetchFollows(int userid, int offset, int limit) {
        return userRepository.fetchFollows(userid, offset, limit);
    }

    public int findFollowingCount(int userid) {
        return userRepository.findFollowingCount(userid);
    }

    public int findFollowersCount(int userid) {
        return userRepository.findFollowersCount(userid);
    }

    public boolean checkFollows(int follower, int followed) {
        return userRepository.checkFollows(follower, followed);
    }

    public String follow(HttpServletRequest request, int followed) {
        return userRepository.follow(Integer.parseInt(request.getHeader("userid")), followed);
    }

    public String unfollow(HttpServletRequest request, int followed) {
        return userRepository.unfollow(Integer.parseInt(request.getHeader("userid")), followed);
    }

    public String createImage(String image, HttpServletRequest request) {
        int userid = Integer.parseInt(request.getHeader("userid"));
        return userRepository.createImage(image, userid);
    }

    public String createUser(HttpServletResponse response, User user) {
        String username = HtmlUtils.htmlEscape(user.getUsername());
        String name = HtmlUtils.htmlEscape(user.getName());
        String email = HtmlUtils.htmlEscape(user.getEmail());
        String password = HtmlUtils.htmlEscape(user.getPassword());
        String generatedPassword = null;
        if(!isValidEmailAddress(email)) { response.setStatus(403); return "Invalid Email Address"; }
        else if(name.length()<=0) { response.setStatus(403); return "Please specify your full name"; }
        else if(username.length()<3) { response.setStatus(403); return "Username should be minimum 3 characters " +
                "long"; }
        else if(password.length()<6) {response.setStatus(403);  return "Password should be minimum 6 characters " +
                "long"; }
        try {
            generatedPassword = authenticationService.createHash(password);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        }

        String status = userRepository.createUser(response, username, name, email, generatedPassword);
        if(status == "Success") userNames.insertWord(userNames.root, username);
        return status;
    }

    public List<String> searchUsers(String username) {
        System.out.println(username);
        return userNames.getAllPrefixMatches(username.substring(1)).subList(0, 20);
    }

    public List<String> getAllUsers() {
        instantiateAutoComplete();
        return null;
    }

    public static boolean isValidEmailAddress(String email) {
        Pattern pattern = Pattern.compile("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*" +
                "(\\.[A-Za-z]{2,})$");
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }
}
