using TBOTBackend.Model;

namespace TBOTBackend.Repositories;

public interface IFriendshipRepository
{
    Task SendFriendRequest(int senderId, int receiverId);
    Task AcceptFriendRequest(int senderId, int receiverId);
    Task DeclineFriendRequest(int senderId, int receiverId);
    Task<Friendship> GetFriendship(int senderId, int receiverId);
}