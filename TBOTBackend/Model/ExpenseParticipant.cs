namespace TBOTBackend.Model;

public class ExpenseParticipant
{
    public int ExpenseId { get; set; }
    public Expense Expense { get; set; }
    
    public int UserId { get; set; }
    public User User { get; set; }
}