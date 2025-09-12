using AuthServer.Core.Dtos;
using FluentValidation;

namespace AuthServer.API.Validations;

public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("E-posta adresi zorunludur.")
            .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.")
            .MaximumLength(256).WithMessage("E-posta adresi 256 karakterden uzun olamaz.");

        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("Kullanıcı adı zorunludur.")
            .Length(3, 50).WithMessage("Kullanıcı adı 3-50 karakter arasında olmalıdır.")
            .Must(ValidationHelpers.IsValidUsernameFormat).WithMessage("Kullanıcı adı sadece harf, rakam, nokta, alt çizgi ve tire içerebilir.");
    }
}
