namespace TBOTBackend.Model;

public class User
{
    public int Id { get; init; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public IList<User> Friends { get; init; }
    public IList<Expense> Expenses { get; init; }
    
}