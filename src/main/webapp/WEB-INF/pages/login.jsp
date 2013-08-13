<%--
  Created by IntelliJ IDEA.
  User: vishnu
  Date: 13/8/13
  Time: 6:28 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>OAuth</title>
</head>
<body>
    <form action="/oauth/authorize" method = "POST">
        <input type="hidden" name="token" value="${token}" />
        <input type="text" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <input type="submit" value="Login"/>
    </form>
</body>
</html>