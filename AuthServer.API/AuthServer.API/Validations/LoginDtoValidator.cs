using AuthServer.Core.Dtos;
using FluentValidation;

namespace AuthServer.API.Validations;

public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("E-posta adresi zorunludur.")
            .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.")
            .MaximumLength(256).WithMessage("E-posta adresi çok uzun.");

        RuleFor(x => x.password)
            .NotEmpty().WithMessage("Şifre zorunludur.")
            .MinimumLength(1).WithMessage("Şifre boş olamaz.")
            .MaximumLength(128).WithMessage("Şifre çok uzun.");
    }
}
