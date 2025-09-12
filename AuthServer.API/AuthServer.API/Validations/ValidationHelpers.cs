using System;

namespace AuthServer.API.Validations;

public static class ValidationHelpers
{
    // Username Validation

    public static bool IsValidUsernameFormat(string? username)
    {
        if (string.IsNullOrEmpty(username)) return true;
        return System.Text.RegularExpressions.Regex.IsMatch(username, @"^[a-zA-Z0-9._-]+$");
    }

    // Password Validation

    public static bool IsStrongPassword(string? password)
    {
        if (string.IsNullOrEmpty(password)) return true;
        return System.Text.RegularExpressions.Regex.IsMatch(password, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$");
    }
    public static bool NotContainUserInfo(string? password, string? username, string? email)
    {
        if (string.IsNullOrEmpty(password)) return true;

        var passwordLower = password.ToLowerInvariant();

        if (!string.IsNullOrEmpty(username))
        {
            var usernameLower = username.ToLowerInvariant();
            if (passwordLower.Contains(usernameLower) || usernameLower.Contains(passwordLower))
                return false;
        }

        if (!string.IsNullOrEmpty(email))
        {
            var emailLocal = email.Split('@')[0]?.ToLowerInvariant();
            if (!string.IsNullOrEmpty(emailLocal) &&
                (passwordLower.Contains(emailLocal) || emailLocal.Contains(passwordLower)))
                return false;
        }

        return true;
    }

    public static bool NotEqualToOtherPassword(string? password, string? otherPassword)
    {
        if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(otherPassword))
            return true;

        return !password.Equals(otherPassword, StringComparison.Ordinal);
    }

    // Token Validation

    public static bool IsValidBase64Token(string? token)
    {
        if (string.IsNullOrEmpty(token)) return true;

        return System.Text.RegularExpressions.Regex.IsMatch(token, @"^[A-Za-z0-9+/=]+$");
    }

    // Role Validation

    public static readonly string[] ValidRoles = { "User", "Manager", "Admin" };

    public static bool IsValidRole(string? role)
    {
        if (string.IsNullOrEmpty(role)) return false;
        return ValidRoles.Contains(role);
    }
}
