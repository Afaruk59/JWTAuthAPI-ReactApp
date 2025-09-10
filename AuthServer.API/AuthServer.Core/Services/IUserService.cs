using System;
using AuthServer.Core.Dtos;
using SharedLibrary.Dtos;

namespace AuthServer.Core.Services;

public interface IUserService
{
    Task<Response<UserAppDto>> CreateUserAsync(CreateUserDto createUserDto);
    Task<Response<UserAppDto>> GetUserByNameAsync(string UserName);
    Task<Response<NoDataDto>> AssignRoleToUser(string userName, string roleName);
    Task<Response<NoDataDto>> CompleteRegistrationAsync(CompleteRegistrationDto completeRegistrationDto);
}
