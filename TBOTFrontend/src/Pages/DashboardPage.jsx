import { useState, useEffect } from "react";
import Navbar from '../Components/Navbar';
import { Container, Row, Col, Button, Form, FormGroup, FormLabel, Stack } from 'react-bootstrap';
import { useLoggedUser } from '../Services/LoggedUserProvider';
import AddFriend from "../Components/AddFriend";
import DeleteFriend from "../Components/DeleteFriend";
import AddFriendModal from "../Components/AddFriendModal";
import AcceptRequest from "../Components/AcceptRequest";


function DashboardPage(){  
    const { loggedUser, setLoggedUser } = useLoggedUser();
    const [balances, setBalances] = useState(undefined);
    const [addFriendModalShow, setAddFriendModalShow] = useState(false);

    useEffect(() => {   
        fetchBalances();
    }, [loggedUser]);

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

    function renderFriends(loggedUser) {
        
        const Friends = [...loggedUser.friendshipsSent, ...loggedUser.friendshipsReceived]
            .filter(friendship => friendship.accepted)            
            
            return Friends.map(friendship => (
                <div key={friendship.id} className="d-flex justify-content-between align-items-center" style={{ margin: '1rem' ,borderBottom: '1px solid black' }}>
                    <div>{friendship.receiverName === null ? friendship.senderName : friendship.receiverName}</div>                    
                    <DeleteFriend onClick={() => deleteFriend(loggedUser.id, friendship.receiverName === null ? friendship.senderId : friendship.receiverId)}/>
                </div>
            ));
        
    }

    function renderFriendRequestes(loggedUser) {
        
        const receivedRequests = loggedUser.friendshipsReceived
        .filter(request => !request.accepted)
        .map(request => (
            <div key={request.id} className="d-flex justify-content-between align-items-center" style={{ margin: '1rem', borderBottom: '1px solid black' }}>
                <div>{request.senderName}</div>
                <div>
                    <AcceptRequest onClick={() => acceptFriend(loggedUser.id, request.senderId)}/>
                    <DeleteFriend onClick={() => deleteFriend(loggedUser.id, request.senderId)}/>
                </div>
            </div>
        ));

        const sentRequests = loggedUser.friendshipsSent
        .filter(request => !request.accepted)
        .map(request => (
            <div key={request.id} className="d-flex justify-content-between align-items-center" style={{ margin: '1rem', borderBottom: '1px solid black' }}>
                <div>{request.receiverName}</div>
                <DeleteFriend onClick={() => deleteFriend(loggedUser.id, request.receiverId)}/>
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
    console.log(loggedUser);
    
    return (
        <>
        <Navbar />
        <Container className='mt-3'>
            <Row className=' text-white'>
                <Col xs={3} md={3} lg={3}>
                    <FormGroup className='d-flex align-items-center'> 
                        <img src='/src/Images/searchIcon.png' alt='search' className='search-image' />
                        <Form.Control type="text" placeholder="Filter by Name" />
                    </FormGroup>
                    <div className="mt-3" style={{backgroundColor: '#067f99', borderRadius: '6px'}}>
                        <div style={{backgroundColor: '#067f99', borderRadius: '6px' , height: '91vh'}}>
                            <div className="d-flex justify-content-between "><div className='ml-3'>Friends</div><AddFriend onClick={() => setAddFriendModalShow(true)}/></div>
                            {renderFriends(loggedUser)}  
                        </div> 
                    </div> 
                </Col>
                <Col xs={6} md={6} lg={6}>
                    <Container style={{backgroundColor: '#067f99', borderRadius: '6px', border: '1px solid black'}}>
                        <Row>
                            <Col className="d-flex justify-content-between align-items-center">
                                <Button variant="warning" style={{width: '33%'}}>Add Expense</Button>
                                <img src='/src/Images/TBOT.png' alt='TBOTimg' className='tbot-image'/>
                                <Button variant="success" style={{width: '33%'}}>Settle Up</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="d-flex justify-content-between align-items-center" style={{borderTop: '1px solid black', borderBottom: '1px solid black'}}>
                                <div className="align-items-center justify-content-center text-center" style={{width: '33%'}}>
                                    <p>You owe</p>
                                    <p className="fonts">15€</p>
                                </div>
                                <div className="align-items-center justify-content-center text-center" style={{width: '33%'}}>
                                    <p>Total balance</p>
                                    <p className="fonts">1555€</p>
                                </div>
                                <div className="align-items-center justify-content-center text-center" style={{width: '33%'}}>
                                    <p>You are owed</p>
                                    <p className="fonts">15€</p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="d-flex justify-content-between align-items-center fonts">
                                <div style={{width: '50%', height: '80vh'}} >
                                    <p>You Owe</p>
                                </div>
                                <div className="text-end" style={{width: '50%', height: '80vh'}}>
                                    <p>You are owed</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>                            
                </Col>
                <Col xs={3} md={3} lg={3} style={{ marginTop: '2.3rem' }}>
                <div className="mt-3" style={{backgroundColor: '#067f99', borderRadius: '6px'}}>
                        <div style={{backgroundColor: '#067f99', borderRadius: '6px' , height: '91vh'}}>
                            <div className="d-flex justify-content-between "><div className='ml-3'>Friend Requests</div><AddFriend onClick={() => setAddFriendModalShow(true)}/></div>
                            {renderFriendRequestes(loggedUser)}  
                        </div>
                    </div>                    
                </Col>
            </Row>
            <AddFriendModal show={addFriendModalShow} fetchUser={fetchUser} onHide={() => setAddFriendModalShow(false)}/>
        </Container>
        </>
    )
}

export default DashboardPage;