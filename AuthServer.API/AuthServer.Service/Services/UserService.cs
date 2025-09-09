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
    private readonly RoleManager<IdentityRole> _roleManager;
    public UserService(UserManager<UserApp> userManager, RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }
    public async Task<Response<UserAppDto>> CreateUserAsync(CreateUserDto createUserDto)
    {
        var user = new UserApp { UserName = createUserDto.UserName, Email = createUserDto.Email, City = null };
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
            City = user.City
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
            City = user.City
        };
        return Response<UserAppDto>.Success(userDto, 200);
    }

    public async Task<Response<NoDataDto>> CreateUserRoles(string userName)
    {
        if (!await _roleManager.RoleExistsAsync("Admin"))
        {
            await _roleManager.CreateAsync(new() { Name = "Admin" });
        }
        if (!await _roleManager.RoleExistsAsync("User"))
        {
            await _roleManager.CreateAsync(new() { Name = "User" });
        }
        var user = await _userManager.FindByNameAsync(userName);
        await _userManager.AddToRoleAsync(user, "Admin");
        await _userManager.AddToRoleAsync(user, "User");
        return Response<NoDataDto>.Success(StatusCodes.Status201Created);
    }
}
