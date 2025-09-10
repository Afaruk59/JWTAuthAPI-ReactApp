using System;

namespace AuthServer.Core.Dtos;

public class CompleteRegistrationDto
{
    public string Email { get; set; }
    public string TemporaryPassword { get; set; }
    public string NewPassword { get; set; }
}


