using System;
using AuthServer.Core.Dtos;
using SharedLibrary.Dtos;

namespace AuthServer.Core.Services;

public interface IAuthenticationService
{
    Task<Response<TokenDto>> CreateTokenAsync(LoginDto loginDto);
    Task<Response<TokenDto>> CreateByRefreshToken(string refreshToken);
    Task<Response<NoDataDto>> RevokeRefreshToken(string refreshToken);
    Response<ClientTokenDto> CreateTokenByClient(ClientLoginDto clientLoginDto);
}
