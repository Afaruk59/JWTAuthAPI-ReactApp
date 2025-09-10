using System;

namespace SharedLibrary.Services;

public interface IEmailService
{
    Task SendAsync(string toEmail, string subject, string bodyHtml);
}


