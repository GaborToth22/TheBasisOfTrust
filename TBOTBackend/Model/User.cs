using Microsoft.AspNetCore.Identity;

namespace TBOTBackend.Model;

public class User : IdentityUser
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public IList<User> Friends { get; set; }
    public IList<Expense> Expenses { get; set; }
    public IList<SettleUp> SettleUps { get; set; }

}