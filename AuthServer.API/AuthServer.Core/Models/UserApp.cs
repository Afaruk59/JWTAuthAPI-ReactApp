using System;
using Microsoft.AspNetCore.Identity;

namespace AuthServer.Core.Models;

public class UserApp : IdentityUser
{
    public string Role { get; set; } = "User"; // Varsayılan rol "User"
    public bool IsRegistrationCompleted { get; set; } = false;
}
