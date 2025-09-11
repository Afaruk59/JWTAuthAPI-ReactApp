using AuthServer.Core.Dtos;
using FluentValidation;

namespace AuthServer.API.Validations;

public class CreateUserByAdminDtoValidator : AbstractValidator<CreateUserByAdminDto>
{
    public CreateUserByAdminDtoValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("Kullanıcı adı boş olamaz.")
            .Length(3, 50).WithMessage("Kullanıcı adı 3-50 karakter arasında olmalıdır.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("E-posta boş olamaz.")
            .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Şifre boş olamaz.")
            .MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalıdır.");

        RuleFor(x => x.Role)
            .NotEmpty().WithMessage("Rol boş olamaz.")
            .Must(role => new[] { "User", "Manager", "Admin" }.Contains(role))
            .WithMessage("Geçerli rol değerleri: User, Manager, Admin");
    }
}