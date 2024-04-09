namespace TBOTBackend.Model;

public class SettleUp
{
    public int Id { get; init; }
    public decimal Amount { get; init; }
    public User PaidBy { get; init; }
    public User Receiver { get; init; }
    public string? Note { get; set; }
    public DateTime Date { get; init; }
}