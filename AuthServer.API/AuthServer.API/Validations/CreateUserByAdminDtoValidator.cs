using AuthServer.Core.Dtos;
using FluentValidation;

namespace AuthServer.API.Validations;

public class CreateUserByAdminDtoValidator : AbstractValidator<CreateUserByAdminDto>
{
    public CreateUserByAdminDtoValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("Kullanıcı adı boş olamaz.")
            .Length(3, 50).WithMessage("Kullanıcı adı 3-50 karakter arasında olmalıdır.")
            .Must(ValidationHelpers.IsValidUsernameFormat).WithMessage("Kullanıcı adı sadece harf, rakam, nokta, alt çizgi ve tire içerebilir.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("E-posta boş olamaz.")
            .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.")
            .MaximumLength(256).WithMessage("E-posta adresi çok uzun.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Şifre boş olamaz.")
            .MinimumLength(8).WithMessage("Şifre en az 8 karakter olmalıdır.")
            .MaximumLength(128).WithMessage("Şifre 128 karakterden uzun olamaz.")
            .Must(ValidationHelpers.IsStrongPassword).WithMessage("Şifre en az 1 küçük harf, 1 büyük harf, 1 rakam ve 1 özel karakter içermelidir.")
            .Must((dto, password) => ValidationHelpers.NotContainUserInfo(password, dto.UserName, dto.Email))
            .WithMessage("Şifre kullanıcı adı veya e-posta bilgilerini içeremez.");

        RuleFor(x => x.Role)
            .NotEmpty().WithMessage("Rol boş olamaz.")
            .Must(ValidationHelpers.IsValidRole).WithMessage($"Geçerli rol değerleri: {string.Join(", ", ValidationHelpers.ValidRoles)}");
    }
}