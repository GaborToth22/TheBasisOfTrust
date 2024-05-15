namespace TBOTBackend.Model;

public class Friendship
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public string SenderName { get; set; }
    public string SenderEmail { get; set; }
    public int ReceiverId { get; set; }
    public string ReceiverName { get; set; }
    public string ReceiverEmail { get; set; }
    public bool Accepted { get; set; }
}