package com.springapp.mvc.data;

import com.springapp.mvc.model.AuthenticatedUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: vishnu
 * Date: 22/7/13
 * Time: 6:25 PM
 */
@Repository
public class AuthenticationRepository {
    private final JdbcTemplate jdbcTemplate;
    private final String PBKDF2_ALGORITHM = "PBKDF2WithHmacSHA1";
    private final int SALT_BYTE_SIZE = 24;
    private final int HASH_BYTE_SIZE = 24;
    private final int PBKDF2_ITERATIONS = 1000;
    private final int ITERATION_INDEX = 0;
    private final int SALT_INDEX = 1;
    private final int PBKDF2_INDEX = 2;

    @Autowired
    public AuthenticationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String addSession(AuthenticatedUser authenticatedUser) {
        final SimpleJdbcInsert insert = new SimpleJdbcInsert(jdbcTemplate);
        insert.setTableName("sessions");
        insert.setColumnNames(Arrays.asList("sessionid", "userid"));
        Map<String, Object> param = new HashMap<>();
        param.put("sessionid", authenticatedUser.getSessionid());
        param.put("userid", authenticatedUser.getUserid());
        try{
            insert.execute(param);
            return "Success";
        }
        catch(Exception e){
            e.printStackTrace();
            return "Error";
        }
    }

    public void endSession(AuthenticatedUser authenticatedUser) {
    }

    public boolean isValidSession(AuthenticatedUser authenticatedUser) {
        int count =  jdbcTemplate.queryForInt("SELECT count(*) FROM sessions WHERE sessionid = ? and userid= ?",
                new Object[]{authenticatedUser.getSessionid(), authenticatedUser.getUserid()});
        if(count>0) return true;
        else return false;
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
        // format iterations:salt:hash
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
