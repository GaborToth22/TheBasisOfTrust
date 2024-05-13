namespace TBOTBackend.Model;

public class Friendship
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public bool Accepted { get; set; }
}