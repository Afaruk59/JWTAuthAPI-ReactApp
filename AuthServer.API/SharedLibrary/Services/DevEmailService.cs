using System;

namespace SharedLibrary.Services;

public class DevEmailService : IEmailService
{
    public Task SendAsync(string toEmail, string subject, string bodyHtml)
    {
        Console.WriteLine($"[DEV EMAIL] To: {toEmail} | Subject: {subject} | Body: {bodyHtml}");
        return Task.CompletedTask;
    }
}


