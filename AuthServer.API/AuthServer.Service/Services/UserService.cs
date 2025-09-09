using AuthServer.Core.Models;
using Microsoft.AspNetCore.Identity;
using SharedLibrary.Dtos;
using AuthServer.Core.Dtos;
using Microsoft.AspNetCore.Http;
using AuthServer.Core.Services;

namespace AuthServer.Service.Services;

public class UserService : IUserService
{
    private readonly UserManager<UserApp> _userManager;
    
    public UserService(UserManager<UserApp> userManager)
    {
        _userManager = userManager;
    }
    public async Task<Response<UserAppDto>> CreateUserAsync(CreateUserDto createUserDto)
    {
        var user = new UserApp { 
            UserName = createUserDto.UserName, 
            Email = createUserDto.Email,
            Role = "User" // Varsayılan rol "User"
        };
        var result = await _userManager.CreateAsync(user, createUserDto.Password);
        if (!result.Succeeded)
        {
            return Response<UserAppDto>.Fail(string.Join(",", result.Errors.Select(x => x.Description)), 400, true);
        }

        var userDto = new UserAppDto
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            Role = user.Role
        };
        return Response<UserAppDto>.Success(userDto, 200);
    }
    public async Task<Response<UserAppDto>> GetUserByNameAsync(string UserName)
    {
        var user = await _userManager.FindByNameAsync(UserName);
        if (user == null)
        {
            return Response<UserAppDto>.Fail("User not found.", 404, true);
        }
        var userDto = new UserAppDto
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            Role = user.Role
        };
        return Response<UserAppDto>.Success(userDto, 200);
    }

    public async Task<Response<NoDataDto>> AssignRoleToUser(string userName, string roleName)
    {
        // Geçerli rol kontrolü
        string[] validRoles = { "User", "Manager", "Admin" };
        if (!validRoles.Contains(roleName))
        {
            return Response<NoDataDto>.Fail($"Invalid role: {roleName}. Valid roles: {string.Join(", ", validRoles)}", 400, true);
        }

        var user = await _userManager.FindByNameAsync(userName);
        if (user == null)
        {
            return Response<NoDataDto>.Fail("User not found.", 404, true);
        }

        // Rol zaten atanmış mı kontrol et
        if (user.Role == roleName)
        {
            return Response<NoDataDto>.Fail($"User already has role: {roleName}", 400, true);
        }

        // Kullanıcının rolünü güncelle (tek rol sistemi)
        user.Role = roleName;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return Response<NoDataDto>.Fail(string.Join(",", result.Errors.Select(x => x.Description)), 400, true);
        }

        return Response<NoDataDto>.Success(200);
    }
}
