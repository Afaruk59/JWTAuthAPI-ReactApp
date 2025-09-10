using System;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace SharedLibrary.Services;

public class SmtpOptions
{
    public string Host { get; set; }
    public int Port { get; set; } = 587;
    public bool EnableSsl { get; set; } = true;
    public string UserName { get; set; }
    public string Password { get; set; }
    public string From { get; set; }
}

public class SmtpEmailService : IEmailService
{
    private readonly SmtpOptions _options;

    public SmtpEmailService(IOptions<SmtpOptions> options)
    {
        _options = options.Value;
    }

    public async Task SendAsync(string toEmail, string subject, string bodyHtml)
    {
        using var client = new SmtpClient(_options.Host, _options.Port)
        {
            EnableSsl = _options.EnableSsl,
            Credentials = new NetworkCredential(_options.UserName, _options.Password)
        };

        var message = new MailMessage
        {
            From = new MailAddress(_options.From),
            Subject = subject,
            Body = bodyHtml,
            IsBodyHtml = true
        };

        message.To.Add(new MailAddress(toEmail));
        await client.SendMailAsync(message);
    }
}


