using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using project.Server.Data;
using project.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> SignUp([FromBody] User user)
    {
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User user)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(x => x.Username == user.Username);

        if (existingUser == null || !BCrypt.Net.BCrypt.Verify(user.PasswordHash, existingUser.PasswordHash))
            return Unauthorized();

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, existingUser.Username),
                new Claim(ClaimTypes.Role, existingUser.Role)
            }),
            Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:DurationInMinutes"])),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"]
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return Ok(new { Token = tokenHandler.WriteToken(token) });
    }

    [HttpGet("role")]
    public async Task<IActionResult> GetUserRole()
    {
        var username = User.Identity?.Name;
        if (username == null)
            return Unauthorized();

        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Username == username);

        if (user == null)
            return NotFound();

        return Ok(new { Role = user.Role });
    }
}
