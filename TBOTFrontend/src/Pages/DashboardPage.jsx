import { useState, useEffect } from "react";
import Navbar from '../Components/Navbar';
import { Container, Row, Col, Button, Form, FormGroup, FormLabel, Stack } from 'react-bootstrap';
import { useLoggedUser } from '../Services/LoggedUserProvider';
import AddFriend from "../Components/AddFriend";
import DeleteFriend from "../Components/DeleteFriend";
import AddFriendModal from "../Components/AddFriendModal";
import AcceptRequest from "../Components/AcceptRequest";
import AddExpenseModal from "../Components/AddExpenseModal";
import SettleUpModal from "../Components/SettleUpModal";


function DashboardPage(){  
    const { loggedUser, setLoggedUser } = useLoggedUser();
    const [balances, setBalances] = useState(undefined);
    const [filter, setFilter] = useState("");
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [addFriendModalShow, setAddFriendModalShow] = useState(false);
    const [addExpenseModalShow, setAddExpenseModalShow] = useState(false);
    const [settleUpModalShow, setSettleUpModalShow] = useState(false);
    const [youOwe, setYouOwe] = useState(0);
    const [total, setTotal] = useState(0);
    const [owesYou, setOwesYou] = useState(0);
    const [userBalances, setUserBalances] = useState({});


    useEffect(() => {   
        fetchBalances();        
    }, [loggedUser, addExpenseModalShow, settleUpModalShow]);

    useEffect(() => {
        if (loggedUser) {
            const filtered = loggedUser.friendshipsSent.concat(loggedUser.friendshipsReceived)
                .filter(friendship => friendship.accepted)
                .filter(friendship => {
                    return friendship.receiverName?.toLowerCase().includes(filter.toLowerCase()) ||
                           friendship.senderName?.toLowerCase().includes(filter.toLowerCase());
                });
            setFilteredFriends(filtered);
        }
    }, [loggedUser, filter]);

    useEffect(() => {
        if (balances && loggedUser) {
            const userBalances = {};
            let youOweSum = 0.00;
            let owesYouSum = 0.00;

            balances.forEach(balance => {
                const amount = balance.amount;                
                console.log(balance.userId)
                if (balance.userId == loggedUser.id) {
                    userBalances[balance.participantUserId] = (userBalances[balance.participantUserId] || 0) + amount;
                } else {
                    userBalances[balance.userId] = (userBalances[balance.userId] || 0) - amount;
                }})

            Object.values(userBalances).forEach(balance => {
                if (balance < 0) {
                    youOweSum += balance;
                } else {
                    owesYouSum += balance;
                }
            });
    console.log(youOweSum)
            const formattedBalances = {};
        Object.keys(userBalances).forEach(key => {
            formattedBalances[key] = userBalances[key].toFixed(2);
        });

        setYouOwe(youOweSum.toFixed(2));
        setOwesYou(owesYouSum.toFixed(2));
        setTotal((owesYouSum + youOweSum).toFixed(2));
        setUserBalances(formattedBalances);
        }
    }, [balances, loggedUser, addExpenseModalShow]);

    const fetchBalances = async () => {
        try {
            const response = await fetch(`/balance/${loggedUser.id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setBalances(data);
        } catch (error) {
            console.error('Error fetching balance data:', error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await fetch(`/users/username/${loggedUser.username}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLoggedUser(data);
        } catch (error) {
            console.error('Error fetching balance data:', error);
        }
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    function renderYouOwe(userBalances) {
      const friendships = loggedUser.friendshipsSent.concat(loggedUser.friendshipsReceived);
      return(
        <>
            {Object.entries(userBalances).map(([userId, balance]) => {
                if (balance < 0) {
                    const friend = friendships.find(friendship => friendship.receiverId == userId || friendship.senderId == userId);
                    const friendName = friend.receiverId == userId ? friend.receiverName : friend.senderName;
                    return (
                        <div key={userId}>
                            <span>{friendName} </span><span style={{ color: '#Fbb090' }}>{balance}</span>                            
                        </div>
                    );
                } else {
                    return null;
                }
            })}
        </>
      )        
    }

    function renderOwesYou(userBalances) {
      const friendships = loggedUser.friendshipsSent.concat(loggedUser.friendshipsReceived);
      return(
        <>
            {Object.entries(userBalances).map(([userId, balance]) => {
                if (balance > 0) {
                    const friend = friendships.find(friendship => friendship.receiverId == userId || friendship.senderId == userId);
                    const friendName = friend.receiverId == userId ? friend.receiverName : friend.senderName;
                    return (
                        <div key={userId}>
                            <span>{friendName} </span><span className='fontsGreen'>{balance}</span>                            
                        </div>
                    );
                } else {
                    return null;
                }
            })}
        </>
      )        
    }

    function renderFriends(loggedUser) {
        
        return (
            <>
                {filteredFriends.map(friendship => (
                    <div key={friendship.id} className="d-flex justify-content-between align-items-center" style={{ margin: '1rem' ,borderBottom: '1px solid black' }}>
                        <div>{friendship.receiverName === null ? friendship.senderName : friendship.receiverName}</div>                    
                        <DeleteFriend text={"Delete Friendship"} onClick={() => deleteFriend(loggedUser.id, friendship.receiverName === null ? friendship.senderId : friendship.receiverId)}/>
                    </div>
                ))}
            </>
        );
    }

    function renderFriendRequestes(loggedUser) {
        
        const receivedRequests = loggedUser.friendshipsReceived
        .filter(request => !request.accepted)
        .map(request => (
            <div key={request.id} className="d-flex justify-content-between align-items-center" style={{ margin: '1rem', borderBottom: '1px solid black' }}>
                <div>{request.senderName}</div>
                <div>
                    <AcceptRequest onClick={() => acceptFriend(loggedUser.id, request.senderId)}/>
                    <DeleteFriend text={"Decline request"} onClick={() => deleteFriend(loggedUser.id, request.senderId)}/>
                </div>
            </div>
        ));

        const sentRequests = loggedUser.friendshipsSent
        .filter(request => !request.accepted)
        .map(request => (
            <div key={request.id} className="d-flex justify-content-between align-items-center" style={{ margin: '1rem', borderBottom: '1px solid black' }}>
                <div>{request.receiverName}</div>
                <DeleteFriend text={"Decline request"} onClick={() => deleteFriend(loggedUser.id, request.receiverId)}/>
            </div>
        ));
            
        return (
            <>                
                {receivedRequests}        
                {sentRequests}
            </>
        );
    }
    
    const deleteFriend = async (senderId, receiverId) => {
        console.log(senderId)
        console.log(receiverId)
        try {
            const response = await fetch(`/friendship/declineRequest/${senderId}/${receiverId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }    
            const data = await response.json();
            console.log(data);        
            fetchUser()
        } catch (error) {
            console.error('Error fetching delete data:', error);
        }
    };

    const acceptFriend = async (senderId, receiverId) => {
        console.log(senderId)
        console.log(receiverId)
        try {
            const response = await fetch(`/friendship/acceptRequest/${senderId}/${receiverId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }    
            const data = await response.json();
            console.log(data);        
            fetchUser()
        } catch (error) {
            console.error('Error fetching delete data:', error);
        }
    };
   

    console.log(balances);
    console.log(userBalances);
    console.log(loggedUser);
    
    return (
        <>
        <Navbar />
        <Container className='mt-3'>
            <Row className=' text-white'>
                <Col xs={3} md={3} lg={3}>
                    <FormGroup className='d-flex align-items-center'> 
                        <img src='/src/Images/searchIcon.png' alt='search' className='search-image' />
                        <Form.Control type="text" placeholder="Filter by Name" value={filter} onChange={handleFilterChange}/>
                    </FormGroup>
                    <div className="mt-3" style={{backgroundColor: '#067f99', borderRadius: '6px'}}>
                        <div style={{backgroundColor: '#067f99', borderRadius: '6px' , height: '91vh'}}>
                            <div className="d-flex justify-content-between "><div className='ml-3'>Friends</div><AddFriend text={"+Add Friend"} onClick={() => setAddFriendModalShow(true)}/></div>
                            {renderFriends(loggedUser)}  
                        </div> 
                    </div> 
                </Col>
                <Col xs={6} md={6} lg={6}>
                    <Container style={{backgroundColor: '#067f99', borderRadius: '6px', border: '1px solid black'}}>
                        <Row>
                            <Col className="d-flex justify-content-between align-items-center">
                                <Button variant="warning" onClick={() => setAddExpenseModalShow(true)} style={{width: '33%'}}>Add Expense</Button>
                                <img src='/src/Images/TBOT.png' alt='TBOTimg' className='tbot-image'/>
                                <Button variant="success" onClick={() => setSettleUpModalShow(true)} style={{width: '33%'}}>Settle Up</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="d-flex justify-content-between align-items-center" style={{borderTop: '1px solid black', borderBottom: '1px solid black'}}>
                                <div className="align-items-center justify-content-center text-center" style={{width: '33%'}}>
                                    <p>You owe</p>
                                    <p className={youOwe !== 0 ? "fontsRed" : "fonts"}>{youOwe} </p>
                                </div>
                                <div className="align-items-center justify-content-center text-center" style={{width: '33%'}}>
                                    <p>Total balance</p>
                                    <p className={total > 0 ? "fontsGreen" : (total < 0 ? "fontsRed" : "fonts")}>{total}</p>
                                </div>
                                <div className="align-items-center justify-content-center text-center" style={{width: '33%'}}>
                                    <p>You are owed</p>
                                    <p className={owesYou !== 0 ? "fontsGreen" : "fonts"}>{owesYou}</p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="d-flex justify-content-between align-items-center fonts">
                                <div style={{width: '50%', height: '80vh'}} >
                                    <p>You Owe</p>
                                    {renderYouOwe(userBalances)}
                                </div>
                                <div className="text-end" style={{width: '50%', height: '80vh'}}>
                                    <p>You are owed</p>
                                    {renderOwesYou(userBalances)}
                                </div>
                            </Col>
                        </Row>
                    </Container>                            
                </Col>
                <Col xs={3} md={3} lg={3} style={{ marginTop: '2.3rem' }}>
                <div className="mt-3" style={{backgroundColor: '#067f99', borderRadius: '6px'}}>
                        <div style={{backgroundColor: '#067f99', borderRadius: '6px' , height: '91vh'}}>
                            <div className="d-flex justify-content-between "><div className='ml-3'>Friend Requests</div><AddFriend text={"+Add Friend"} onClick={() => setAddFriendModalShow(true)}/></div>
                            {renderFriendRequestes(loggedUser)}  
                        </div>
                    </div>                    
                </Col>
            </Row>
            <AddFriendModal show={addFriendModalShow} fetchUser={fetchUser} onHide={() => setAddFriendModalShow(false)}/>
            <AddExpenseModal show={addExpenseModalShow} fetchUser={fetchUser} onHide={() => setAddExpenseModalShow(false)}/>
            <SettleUpModal show={settleUpModalShow} userBalances={userBalances} fetchUser={fetchUser} onHide={() => setSettleUpModalShow(false)}/>
        </Container>
        </>
    )
}

export default DashboardPage;