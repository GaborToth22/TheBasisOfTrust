using Microsoft.EntityFrameworkCore;
using TBOTBackend.Data;
using TBOTBackend.Model;

namespace TBOTBackend.Repositories;

public class FriendshipRepository : IFriendshipRepository
{
    private readonly DatabaseContext _dbContext;
    private readonly IUserRepository _userRepository;
    
    
    public FriendshipRepository(DatabaseContext dbContext, IUserRepository userRepository)
    {
        _dbContext = dbContext;
        _userRepository = userRepository;
    }
    
    public async Task<string> SendFriendRequest(int senderId, int receiverId)
    {
        var existingFriendship = await _dbContext.Friendships
            .FirstOrDefaultAsync(f =>
                (f.SenderId == senderId && f.ReceiverId == receiverId) ||
                (f.SenderId == receiverId && f.ReceiverId == senderId));
        
        if (existingFriendship != null)
        {
            return "The friend request has already been sent or you are connected with this user.";
            
        }
        var sender = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == senderId);
        var receiver = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == receiverId);
        
        var friendship = new Friendship
        {
            SenderId = senderId,
            SenderName = sender.Username,
            SenderEmail = sender.Email,
            ReceiverId = receiverId,
            ReceiverName = receiver.Username,
            ReceiverEmail = receiver.Email,
            Accepted = false
        };

        _dbContext.Friendships.Add(friendship);
        await _dbContext.SaveChangesAsync();
        
        return "Friend request sent successfully.";
    }

    public async Task<string> AcceptFriendRequest(int senderId, int receiverId)
    {
        var friendship = await _dbContext.Friendships
            .FirstOrDefaultAsync(f => 
                (f.SenderId == senderId && f.ReceiverId == receiverId) || (f.SenderId == receiverId && f.ReceiverId == senderId));

        if (friendship != null)
        {
            friendship.Accepted = true;
            await _dbContext.SaveChangesAsync();
            return "Friend request accepted succesfully.";
        }
        
        return "Friend request don't found";
    }

    public async Task<string> DeclineFriendRequest(int senderId, int receiverId)
    {
        var friendship = await _dbContext.Friendships.FirstOrDefaultAsync(f =>
            (f.SenderId == senderId && f.ReceiverId == receiverId) || (f.SenderId == receiverId && f.ReceiverId == senderId));

        if (friendship != null)
        {
            _dbContext.Friendships.Remove(friendship);
            await _dbContext.SaveChangesAsync();
            return "Friend request deleted succesfully.";
        }
        return "Friend request don't found";
    }
    
    public async Task<List<Friendship>> GetAllFriendshipsById(int userId)
    {
        var friendshipsS = await _dbContext.Friendships
            .Where(f => f.SenderId == userId)
            .ToListAsync(); 
        
        var friendshipsR = await _dbContext.Friendships
            .Where(f => f.ReceiverId == userId)
            .ToListAsync();
        

        var allFriendships = friendshipsS.Concat(friendshipsR).ToList();

        return allFriendships;
    }

    public async Task<List<User>> CheckFriendshipsForPaidBy(List<int> userIds)
    {
        var users = new List<User>();
        foreach (var userId in userIds)
        {
            var user = await _userRepository.GetUserById(userId);
            var friendships = 0;
            foreach (var userId2 in userIds)
            {
                if (userId != userId2)
                {
                    var friendship = await _dbContext.Friendships.FirstOrDefaultAsync(f =>
                        (f.SenderId == userId && f.ReceiverId == userId2) ||
                        (f.SenderId == userId2 && f.ReceiverId == userId));

                    if (friendship != null && friendship.Accepted)
                    {
                        friendships++;
                    }
                }
            }

            if (friendships == userIds.Count - 1)
            {
                users.Add(user);
            }
        }

        return users;
    }
}