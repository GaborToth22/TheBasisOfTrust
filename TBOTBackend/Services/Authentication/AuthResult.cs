namespace TBOTBackend.Services.Authentication;

public record AuthResult(
    bool Success,
    string Email,
    string Username,
    string Token)
{
public readonly Dictionary<string, string> ErrorMessages = new();
}