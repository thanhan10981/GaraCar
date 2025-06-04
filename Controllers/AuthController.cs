using GaraCarAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Text;
using System.Security.Cryptography;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly GaraCarContext _context;
    private readonly IMemoryCache _cache;
    private readonly IEmailService _emailService;

    public AuthController(GaraCarContext context, IMemoryCache cache, IEmailService emailService)
    {
        _context = context;
        _cache = cache;
        _emailService = emailService;
    }

    // ✅ Gửi OTP
    [HttpPost("gui-otp")]
    public async Task<IActionResult> GuiOtp([FromBody] string email)

    {
        var user = await _context.NhanViens.FirstOrDefaultAsync(x => x.Email == email);
        if (user == null)
            return NotFound("Email không tồn tại");

        var otp = new Random().Next(100000, 999999).ToString();

        // Lưu OTP vào cache 5 phút
        _cache.Set(email, otp, TimeSpan.FromMinutes(5));

        await _emailService.SendAsync(email, "Mã OTP đặt lại mật khẩu", $"Mã OTP của bạn là: {otp}");

        return Ok(new { message = "Mã OTP đã được gửi tới email." });

    }

    // ✅ Đặt lại mật khẩu bằng OTP
    [HttpPost("dat-lai-mat-khau-otp")]
    public async Task<IActionResult> DatLaiMatKhau([FromBody] ResetPasswordOtpRequest req)
    {
        // 1. Không tìm thấy OTP trong cache (hết hạn)
        if (!_cache.TryGetValue(req.Email, out string cachedOtp))
            return BadRequest("❌ Mã OTP đã hết hạn. Vui lòng gửi lại.");

        // 2. OTP sai
        if (cachedOtp != req.OtpCode)
            return BadRequest("❌ Mã OTP không đúng.");

        // 3. Kiểm tra người dùng
        var user = await _context.NhanViens.FirstOrDefaultAsync(x => x.Email == req.Email);
        if (user == null)
            return NotFound("❌ Email không tồn tại.");

        // 4. Mã hoá mật khẩu
        var bytes = Encoding.UTF8.GetBytes(req.NewPassword);
        using var sha = SHA256.Create();
        var hashed = sha.ComputeHash(bytes);
        user.MatKhau = BitConverter.ToString(hashed).Replace("-", "").ToLower();

        await _context.SaveChangesAsync();
        _cache.Remove(req.Email); // Xoá OTP

        return Ok(new { message = "✅ Mật khẩu đã được đặt lại thành công!" });
    }

}

public class ResetPasswordOtpRequest
{
    public string Email { get; set; }
    public string OtpCode { get; set; }
    public string NewPassword { get; set; }
}
