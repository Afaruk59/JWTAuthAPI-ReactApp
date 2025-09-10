using System;
using AuthServer.Core.Dtos;
using FluentValidation;

namespace AuthServer.API.Validations;

public class CompleteRegistrationDtoValidator : AbstractValidator<CompleteRegistrationDto>
{
    public CompleteRegistrationDtoValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.TemporaryPassword).NotEmpty();
        RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(6);
    }
}


