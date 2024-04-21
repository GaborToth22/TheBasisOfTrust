using Microsoft.EntityFrameworkCore;
using TBOTBackend.Data;
using TBOTBackend.Model;

namespace TBOTBackend.Repositories;

public class FriendshipRepository : IFriendshipRepository
{
    private readonly DatabaseContext _dbContext;
    
    
    public FriendshipRepository(DatabaseContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task SendFriendRequest(int senderId, int receiverId)
    {
        var friendship = new Friendship
        {
            UserId = senderId,
            FriendId = receiverId,
            Accepted = false 
        };

        _dbContext.Friendships.Add(friendship);
        await _dbContext.SaveChangesAsync();
    }

    public async Task AcceptFriendRequest(int senderId, int receiverId)
    {
        var friendship = await _dbContext.Friendships
            .FirstOrDefaultAsync(f => 
                (f.UserId == senderId && f.FriendId == receiverId || f.UserId == receiverId && f.FriendId == senderId) 
                && !f.Accepted);

        if (friendship != null)
        {
            friendship.Accepted = true;
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task DeclineFriendRequest(int senderId, int receiverId)
    {
        var friendship = await _dbContext.Friendships.FirstOrDefaultAsync(f =>
            (f.UserId == senderId && f.FriendId == receiverId) || (f.UserId == receiverId && f.FriendId == senderId));

        if (friendship != null)
        {
            _dbContext.Friendships.Remove(friendship);
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task<Friendship> GetFriendship(int senderId, int receiverId)
    {
        return await _dbContext.Friendships
            .SingleOrDefaultAsync(f => (f.UserId == senderId && f.FriendId == receiverId) || (f.UserId == receiverId && f.FriendId == senderId));
    }
}