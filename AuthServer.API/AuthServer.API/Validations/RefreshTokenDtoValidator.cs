using AuthServer.Core.Dtos;
using FluentValidation;

namespace AuthServer.API.Validations;

public class RefreshTokenDtoValidator : AbstractValidator<RefreshTokenDto>
{
    public RefreshTokenDtoValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Refresh token zorunludur.")
            .MinimumLength(20).WithMessage("Refresh token formatı hatalı.")
            .MaximumLength(200).WithMessage("Refresh token çok uzun.")
            .Must(ValidationHelpers.IsValidBase64Token).WithMessage("Refresh token formatı geçersiz.");
    }
}
