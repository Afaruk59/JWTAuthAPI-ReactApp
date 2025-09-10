using AuthServer.Core.Services;
using Microsoft.AspNetCore.Mvc;
using AuthServer.Core.Dtos;
using AuthServer.API.Controllers;
using Microsoft.AspNetCore.Authorization;

namespace AuthServer.API.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class UserController : CustomBaseControler
{
    private readonly IUserService _userService;
    public UserController(IUserService userService)
    {
        _userService = userService;
    }
    [HttpPost]
    public async Task<IActionResult> CreateUser(CreateUserDto createUserDto)
    {
        return ActionResultInstance(await _userService.CreateUserAsync(createUserDto));
    }
    [HttpPost]
    public async Task<IActionResult> CompleteRegistration(CompleteRegistrationDto dto)
    {
        return ActionResultInstance(await _userService.CompleteRegistrationAsync(dto));
    }
    [Authorize(AuthenticationSchemes = "Bearer")]
    [HttpGet]
    public async Task<IActionResult> GetUser()
    {
        return ActionResultInstance(await _userService.GetUserByNameAsync(HttpContext.User.Identity.Name));
    }
    [HttpPost("{userName}/{roleName}")]
    public async Task<IActionResult> AssignRole(string userName, string roleName)
    {
        return ActionResultInstance(await _userService.AssignRoleToUser(userName, roleName));
    }
}
