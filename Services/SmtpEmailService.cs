using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

public interface IEmailService
{
    Task SendAsync(string to, string subject, string body);
}

public class SmtpEmailService : IEmailService
{
    public async Task SendAsync(string to, string subject, string body)
    {
        var message = new MailMessage();
        message.From = new MailAddress("hanhan3316@gmail.com", "GaraCar Rapidfix"); 
        message.To.Add(to);
        message.Subject = subject;
        message.Body = body;
        var client = new SmtpClient("smtp.gmail.com", 587)
        {
            Credentials = new NetworkCredential("hanhan3316@gmail.com", "mxfh uazf bhim lmgp"),
            EnableSsl = true
        };

        await client.SendMailAsync(message);
    }
}
