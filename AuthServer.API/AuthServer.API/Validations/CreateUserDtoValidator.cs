using System;
using AuthServer.Core.Dtos;
using FluentValidation;

namespace AuthServer.API.Validations;

public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserDtoValidator()
    {
        RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required.").EmailAddress().WithMessage("Email is wrong.");

        RuleFor(x => x.UserName).NotEmpty().WithMessage("Username is required.");

    }
}
