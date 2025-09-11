using System;

namespace AuthServer.Core.Dtos;

public class CreateUserByAdminDto
{
    public string UserName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; } = "User";
}
