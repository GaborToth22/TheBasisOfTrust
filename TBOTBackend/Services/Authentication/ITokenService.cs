using Microsoft.AspNetCore.Identity;

namespace TBOTBackend.Services.Authentication;

public interface ITokenService
{
    public string CreateToken(IdentityUser user);
}