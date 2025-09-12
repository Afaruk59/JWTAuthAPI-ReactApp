using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.AccessControl;
using System.Security.Claims;
using System.Security.Cryptography;
using AuthServer.Core.Dtos;
using AuthServer.Core.Models;
using AuthServer.Core.Services;
using Azure.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SharedLibrary.Config;
using SharedLibrary.Services;

namespace AuthServer.Service.Services;

public class TokenService : ITokenService
{
    private readonly UserManager<UserApp> _userManager;
    private readonly CustomTokenOption _tokenOption;

    public TokenService(UserManager<UserApp> userManager, IOptions<CustomTokenOption> options)
    {
        _userManager = userManager;
        _tokenOption = options.Value;
    }

    private string CreateRefreshToken()
    {
        var numberByte = new Byte[32];
        using var rnd = RandomNumberGenerator.Create();

        rnd.GetBytes(numberByte);
        return Convert.ToBase64String(numberByte);
    }

    private IEnumerable<Claim> GetClaims(UserApp userApp, List<String> audiences)
    {
        var userList = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userApp.Id),
            new(JwtRegisteredClaimNames.Email, userApp.Email ?? ""),
            new(ClaimTypes.Name, userApp.UserName ?? ""),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.Role, userApp.Role)  
        };
        
        userList.AddRange(audiences.Select(x => new Claim(JwtRegisteredClaimNames.Aud, x)));
        return userList;
    }



    public TokenDto CreateToken(UserApp userApp)
    {
        var accessTokenExpiration = DateTime.Now.AddMinutes(_tokenOption.AccessTokenExpiration);
        var refreshTokenExpiration = DateTime.Now.AddMinutes(_tokenOption.RefreshTokenExpiration);
        var securityKey = SignService.GetSymmetricSecurityKey(_tokenOption.SecurityKey);

        SigningCredentials signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

        JwtSecurityToken jwtSecurityToken = new JwtSecurityToken(issuer: _tokenOption.Issuer, expires: accessTokenExpiration,
        notBefore: DateTime.Now, claims: GetClaims(userApp, _tokenOption.Audience), signingCredentials: signingCredentials);

        var handler = new JwtSecurityTokenHandler();
        var token = handler.WriteToken(jwtSecurityToken);
        var tokenDto = new TokenDto
        {
            AccessToken = token,
            RefreshToken = CreateRefreshToken(),
            AccessTokenExpiration = accessTokenExpiration,
            RefreshTokenExpiration = refreshTokenExpiration
        };

        return tokenDto;
    }

}
