using AuthServer.Core.Models;
using Microsoft.AspNetCore.Identity;
using SharedLibrary.Dtos;
using AuthServer.Core.Dtos;
using Microsoft.AspNetCore.Http;
using AuthServer.Core.Services;
using SharedLibrary.Services;
using Microsoft.EntityFrameworkCore;

namespace AuthServer.Service.Services;

public class UserService : IUserService
{
    private readonly UserManager<UserApp> _userManager;
    private readonly IEmailService _emailService;
    private const int TemporaryPasswordLength = 10;
    
    public UserService(UserManager<UserApp> userManager, IEmailService emailService)
    {
        _userManager = userManager;
        _emailService = emailService;
    }
    public async Task<Response<UserAppDto>> CreateUserAsync(CreateUserDto createUserDto)
    {
        var user = new UserApp { 
            UserName = createUserDto.UserName, 
            Email = createUserDto.Email,
            Role = "User",
            IsRegistrationCompleted = false
        };

        var tempPassword = GenerateTemporaryPassword();
        var result = await _userManager.CreateAsync(user, tempPassword);
        if (!result.Succeeded)
        {
            return Response<UserAppDto>.Fail(string.Join(",", result.Errors.Select(x => x.Description)), 400, true);
        }

        try
        {
            await _emailService.SendAsync(user.Email!, "Geçici Şifreniz",
                $"<p>Merhaba {user.UserName},</p><p>Geçici şifreniz: <b>{tempPassword}</b></p><p>Lütfen uygulamada 'Kaydı Tamamla' adımından yeni şifrenizi belirleyin.</p>");
        }
        catch (Exception)
        {
            // E-posta gönderimi başarısız olursa kullanıcıyı geri al
            await _userManager.DeleteAsync(user);
            return Response<UserAppDto>.Fail("E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.", 500, true);
        }

        var userDto = new UserAppDto
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            Role = user.Role,
            IsRegistrationCompleted = user.IsRegistrationCompleted
        };
        return Response<UserAppDto>.Success(userDto, 200);
    }
    public async Task<Response<UserAppDto>> GetUserByNameAsync(string UserName)
    {
        var user = await _userManager.FindByNameAsync(UserName);
        if (user == null)
        {
            return Response<UserAppDto>.Fail("User not found.", 404, true);
        }
        var userDto = new UserAppDto
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            Role = user.Role,
            IsRegistrationCompleted = user.IsRegistrationCompleted
        };
        return Response<UserAppDto>.Success(userDto, 200);
    }

    public async Task<Response<NoDataDto>> AssignRoleToUser(string userName, string roleName)
    {
        // Geçerli rol kontrolü
        string[] validRoles = { "User", "Manager", "Admin" };
        if (!validRoles.Contains(roleName))
        {
            return Response<NoDataDto>.Fail($"Invalid role: {roleName}. Valid roles: {string.Join(", ", validRoles)}", 400, true);
        }

        var user = await _userManager.FindByNameAsync(userName);
        if (user == null)
        {
            return Response<NoDataDto>.Fail("User not found.", 404, true);
        }

        // Rol zaten atanmış mı kontrol et
        if (user.Role == roleName)
        {
            return Response<NoDataDto>.Fail($"User already has role: {roleName}", 400, true);
        }

        // Kullanıcının rolünü güncelle (tek rol sistemi)
        user.Role = roleName;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return Response<NoDataDto>.Fail(string.Join(",", result.Errors.Select(x => x.Description)), 400, true);
        }

        return Response<NoDataDto>.Success(200);
    }

    public async Task<Response<NoDataDto>> CompleteRegistrationAsync(CompleteRegistrationDto completeRegistrationDto)
    {
        var user = await _userManager.FindByEmailAsync(completeRegistrationDto.Email);
        if (user == null)
        {
            return Response<NoDataDto>.Fail("User not found.", 404, true);
        }

        if (user.IsRegistrationCompleted)
        {
            return Response<NoDataDto>.Fail("Registration already completed.", 400, true);
        }

        var passwordCheck = await _userManager.CheckPasswordAsync(user, completeRegistrationDto.TemporaryPassword);
        if (!passwordCheck)
        {
            return Response<NoDataDto>.Fail("Temporary password is wrong.", 400, true);
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var resetResult = await _userManager.ResetPasswordAsync(user, token, completeRegistrationDto.NewPassword);
        if (!resetResult.Succeeded)
        {
            return Response<NoDataDto>.Fail(string.Join(",", resetResult.Errors.Select(x => x.Description)), 400, true);
        }

        user.IsRegistrationCompleted = true;
        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            return Response<NoDataDto>.Fail(string.Join(",", updateResult.Errors.Select(x => x.Description)), 400, true);
        }

        return Response<NoDataDto>.Success(200);
    }

    public async Task<Response<IEnumerable<UserAppDto>>> GetAllUsersAsync()
    {
        var users = _userManager.Users.Select(u => new UserAppDto
        {
            Id = u.Id,
            UserName = u.UserName!,
            Email = u.Email!,
            Role = u.Role,
            IsRegistrationCompleted = u.IsRegistrationCompleted
        });

        return Response<IEnumerable<UserAppDto>>.Success(await users.ToListAsync(), 200);
    }

    public async Task<Response<NoDataDto>> DeleteUserAsync(string userName)
    {
        var user = await _userManager.FindByNameAsync(userName);
        if (user == null)
        {
            return Response<NoDataDto>.Fail("User not found.", 404, true);
        }

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            return Response<NoDataDto>.Fail(string.Join(",", result.Errors.Select(x => x.Description)), 400, true);
        }

        return Response<NoDataDto>.Success(200);
    }

    private static string GenerateTemporaryPassword()
    {
        // Kimlik varsayılan politikası: min 6, en az 1 büyük, 1 küçük, 1 rakam (NonAlpha opsiyonel)
        const string upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        const string lower = "abcdefghijkmnopqrstuvwxyz";
        const string digits = "23456789";
        const string specials = "!@#$%^&*";

        var all = upper + lower + digits + specials;
        var bytes = new byte[TemporaryPasswordLength];
        System.Security.Cryptography.RandomNumberGenerator.Fill(bytes);

        var pwd = new char[TemporaryPasswordLength];
        // En az birinden garanti et
        pwd[0] = upper[bytes[0] % upper.Length];
        pwd[1] = lower[bytes[1] % lower.Length];
        pwd[2] = digits[bytes[2] % digits.Length];
        pwd[3] = specials[bytes[3] % specials.Length];
        for (int i = 4; i < TemporaryPasswordLength; i++)
        {
            pwd[i] = all[bytes[i] % all.Length];
        }
        // Karıştır
        return new string(pwd.OrderBy(_ => Guid.NewGuid()).ToArray());
    }
}
