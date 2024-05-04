using TBOTBackend.Model;

namespace TBOTBackend.Repositories;

public interface IFriendshipRepository
{
    Task<string> SendFriendRequest(int senderId, int receiverId);
    Task<string> AcceptFriendRequest(int senderId, int receiverId);
    Task<string> DeclineFriendRequest(int senderId, int receiverId);
    Task<List<Friendship>> GetAllFriendshipsById(int userId);
}