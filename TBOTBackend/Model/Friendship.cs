namespace TBOTBackend.Model;

public class Friendship
{
    public int Id { get; init; }
    public int UserId { get; init; }
    public int FriendId { get; init; }
    public User User { get; set; }
    public User Friend { get; set; }
    public bool Accepted { get; set; }
}