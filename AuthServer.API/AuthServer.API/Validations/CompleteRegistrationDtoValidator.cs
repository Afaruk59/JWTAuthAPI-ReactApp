using AuthServer.Core.Dtos;
using FluentValidation;

namespace AuthServer.API.Validations;

public class CompleteRegistrationDtoValidator : AbstractValidator<CompleteRegistrationDto>
{
    public CompleteRegistrationDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("E-posta adresi zorunludur.")
            .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.")
            .MaximumLength(256).WithMessage("E-posta adresi çok uzun.");

        RuleFor(x => x.TemporaryPassword)
            .NotEmpty().WithMessage("Geçici şifre zorunludur.")
            .Length(8, 50).WithMessage("Geçici şifre formatı hatalı.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("Yeni şifre zorunludur.")
            .MinimumLength(8).WithMessage("Yeni şifre en az 8 karakter olmalıdır.")
            .MaximumLength(128).WithMessage("Yeni şifre 128 karakterden uzun olamaz.")
            .Must(ValidationHelpers.IsStrongPassword).WithMessage("Yeni şifre en az 1 küçük harf, 1 büyük harf, 1 rakam ve 1 özel karakter içermelidir.")
            .Must((dto, password) => ValidationHelpers.NotContainUserInfo(password, null, dto.Email))
            .WithMessage("Yeni şifre e-posta bilgilerinizi içeremez.")
            .Must((dto, password) => ValidationHelpers.NotEqualToOtherPassword(password, dto.TemporaryPassword))
            .WithMessage("Yeni şifre geçici şifre ile aynı olamaz.");
    }
}


