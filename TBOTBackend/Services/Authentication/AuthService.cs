using Microsoft.AspNetCore.Identity;

namespace TBOTBackend.Services.Authentication;

public class AuthService : IAuthService
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ITokenService _tokenService;

    public AuthService(UserManager<IdentityUser> userManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }
    
    public async Task<AuthResult> RegisterAsync(string email, string username, string password)
    {
        var user = new IdentityUser { UserName = username, Email = email };
        var result = await _userManager.CreateAsync(user, password);

        if (!result.Succeeded)
        {
            return FailedRegistration(result, email, username);
        }
        
        return new AuthResult(true, email, username, "");
    }

    public async Task<AuthResult> LoginAsync(string username, string password)
    {
        var managedUser = await _userManager.FindByNameAsync(username);

        if (managedUser == null)
        {
            return InvalidUsername(username);
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(managedUser, password);
        if (!isPasswordValid)
        {
            return InvalidPassword(managedUser.Email, managedUser.UserName);
        }
        
        var accessToken = _tokenService.CreateToken(managedUser);

        return new AuthResult(true, managedUser.Email, managedUser.UserName, accessToken);
    }
    
    private static AuthResult FailedRegistration(IdentityResult result, string email, string username)
    {
        var authResult = new AuthResult(false, email, username, "");

        foreach (var error in result.Errors)
        {
            authResult.ErrorMessages.Add(error.Code, error.Description);
        }

        return authResult;
    }

    private static AuthResult InvalidUsername(string username)
    {
        var result = new AuthResult(false, "",username,"");
        result.ErrorMessages.Add("Bad credentials", "Invalid username");
        return result;
    }
    private static AuthResult InvalidEmail(string email)
    {
        var result = new AuthResult(false, email, "", "");
        result.ErrorMessages.Add("Bad credentials", "Invalid email");
        return result;
    }

    private static AuthResult InvalidPassword(string email, string userName)
    {
        var result = new AuthResult(false, email, userName, "");
        result.ErrorMessages.Add("Bad credentials", "Invalid password");
        return result;
    }
}