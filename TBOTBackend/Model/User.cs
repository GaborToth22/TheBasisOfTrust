using Microsoft.AspNetCore.Identity;

namespace TBOTBackend.Model;

public class User 
{
    public int Id { get; init; }
    public string Username { get; set; }
    public string Email { get; set; }
    public ICollection<Friendship> Friendships { get; set; }
}