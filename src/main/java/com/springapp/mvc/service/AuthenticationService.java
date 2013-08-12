package com.springapp.mvc.service;

import com.springapp.mvc.data.AuthenticationRepository;
import com.springapp.mvc.data.UserRepository;
import com.springapp.mvc.model.AuthenticatedUser;
import com.springapp.mvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.servlet.http.HttpServletResponse;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 11/8/13
 * Time: 10:08 AM
 */
@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final AuthenticationRepository authenticationRepository;
    private SecureRandom random = new SecureRandom();
    private final String PBKDF2_ALGORITHM = "PBKDF2WithHmacSHA1";
    private final int SALT_BYTE_SIZE = 24;
    private final int HASH_BYTE_SIZE = 24;
    private final int PBKDF2_ITERATIONS = 1000;
    private final int ITERATION_INDEX = 0;
    private final int SALT_INDEX = 1;
    private final int PBKDF2_INDEX = 2;


    @Autowired
    public AuthenticationService(UserRepository userRepository, AuthenticationRepository authenticationRepository) {
        this.userRepository = userRepository;
        this.authenticationRepository = authenticationRepository;
    }

    @Scheduled(fixedDelay = 600000)
    public void invalidateSessions() {
        authenticationRepository.invalidateSessions();
    }

    public Map<String, Object> login(String email, String password, HttpServletResponse response) {
        User user = userRepository.findByEmail(email);
        if(user == null) {
            response.setStatus(403);
            return null;
        }
        try {
            if(this.validatePassword(password, user.getPassword())) {
                String sessionid = new BigInteger(130, random).toString(32);
                AuthenticatedUser session = new AuthenticatedUser(sessionid, user.getUserid());
                User authenticatedUser = userRepository.findById(user.getUserid());
                Map<String, Object> sessionMap = new HashMap<>();
                sessionMap.put("sessionid", sessionid);
                sessionMap.put("user", authenticatedUser);
                authenticationRepository.addSession(session);
                response.setStatus(200);
                return sessionMap;
            }
            else {
                response.setStatus(403);
                return null;
            }
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        }
        return null;
    }

    public void logout(String sessionid, int userid) {
        authenticationRepository.endSession(new AuthenticatedUser(sessionid, userid));
    }

    public String createHash(String password)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        return createHash(password.toCharArray());
    }

    public String createHash(char[] password)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[SALT_BYTE_SIZE];
        random.nextBytes(salt);
        byte[] hash = pbkdf2(password, salt, PBKDF2_ITERATIONS, HASH_BYTE_SIZE);
        return PBKDF2_ITERATIONS + ":" + toHex(salt) + ":" +  toHex(hash);
    }
    public boolean validatePassword(String password, String correctHash)
            throws NoSuchAlgorithmException, InvalidKeySpecException
    {
        return validatePassword(password.toCharArray(), correctHash);
    }

    public boolean validatePassword(char[] password, String correctHash)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        String[] params = correctHash.split(":");
        int iterations = Integer.parseInt(params[ITERATION_INDEX]);
        byte[] salt = fromHex(params[SALT_INDEX]);
        byte[] hash = fromHex(params[PBKDF2_INDEX]);
        byte[] testHash = pbkdf2(password, salt, iterations, hash.length);
        return slowEquals(hash, testHash);
    }

    private boolean slowEquals(byte[] a, byte[] b) {
        int diff = a.length ^ b.length;
        for(int i = 0; i < a.length && i < b.length; i++)
            diff |= a[i] ^ b[i];
        return diff == 0;
    }

    private byte[] pbkdf2(char[] password, byte[] salt, int iterations, int bytes)
            throws NoSuchAlgorithmException, InvalidKeySpecException
    {
        PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, bytes * 8);
        SecretKeyFactory skf = SecretKeyFactory.getInstance(PBKDF2_ALGORITHM);
        return skf.generateSecret(spec).getEncoded();
    }

    private byte[] fromHex(String hex) {
        byte[] binary = new byte[hex.length() / 2];
        for(int i = 0; i < binary.length; i++)
        {
            binary[i] = (byte)Integer.parseInt(hex.substring(2*i, 2*i+2), 16);
        }
        return binary;
    }

    private String toHex(byte[] array)
    {
        BigInteger bi = new BigInteger(1, array);
        String hex = bi.toString(16);
        int paddingLength = (array.length * 2) - hex.length();
        if(paddingLength > 0)
            return String.format("%0" + paddingLength + "d", 0) + hex;
        else
            return hex;
    }
}
