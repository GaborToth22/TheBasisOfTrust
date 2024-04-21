using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using TBOTBackend.Contracts;
using TBOTBackend.Model;
using TBOTBackend.Repositories;
using TBOTBackend.Services.Authentication;

namespace TBOTBackend.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authenticationService;
    private readonly IUserRepository _userRepository;

    public AuthController(IAuthService authenticationService, IUserRepository userRepository)
    {
        _authenticationService = authenticationService;
        _userRepository = userRepository;
    }

    [HttpPost("register")]
    public async Task<ActionResult<RegistrationResponse>> Register(RegistrationRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result =
            await _authenticationService.RegisterAsync(request.Email, request.Username, request.Password);

        if (!result.Success)
        {
            AddErrors(result);
            return BadRequest(ModelState);
        }
        
        try
        {
            _userRepository.AddUserToDb(request.Username, request.Email);
            return CreatedAtAction(nameof(Register), new RegistrationResponse(result.Email, result.Username));
        }
        catch (Exception e)
        {
            return BadRequest("Error create user.");
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<string>> Authenticate([FromBody] AuthRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authenticationService.LoginAsync(request.Username, request.Password);

        if (!result.Success)
        {
            AddErrors(result);
            return BadRequest(ModelState);
        }
        
        Response.Cookies.Append("token", result.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict
        });
        return Ok();
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok("User logged out successfully.");
    }

    private void AddErrors(AuthResult result)
    {
        foreach (var error in result.ErrorMessages)
        {
            ModelState.AddModelError(error.Key, error.Value);
        }
    }
}