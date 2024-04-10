namespace TBOTBackend.Model;

public class SettleUp
{
    public int Id { get; init; }
    public decimal Amount { get; init; }
    public string PaidByUserId { get; init; }
    public string ReceiverUserId { get; init; }
    public DateTime Date { get; init; }
}