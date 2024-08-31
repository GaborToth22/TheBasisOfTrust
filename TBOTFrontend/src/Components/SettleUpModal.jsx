import {Modal, Button, Form, FormGroup, FormLabel, Row, Col  } from 'react-bootstrap';
import React, { useState } from 'react';
import { useLoggedUser } from '../Services/LoggedUserProvider';
import DeleteFriend from './DeleteFriend';
import AddFriend from './AddFriend';

function SettleUpModal(props) {
  const { loggedUser, setLoggedUser } = useLoggedUser();
  const { userBalances } = props;
  const [selectedFriend, setSelectedFriend] = useState(null);    
  const [amount, setAmount] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [paidBy, setPaidBy] = useState(loggedUser.id);
  const [message, setMessage] = useState("");

  const handleFilterChange = (event) => {
    setSelectedFriend(event.target.value);
    const balance = -1*userBalances[event.target.value];
    setAmount(balance);
  };

  const handlePaidByChange = (event) => {
    if(event.target.value == loggedUser.id && selectedFriend == loggedUser.id){
      setSelectedFriend(null)
    }else if(event.target.value !== loggedUser.id){
      setSelectedFriend(loggedUser.id)
    }
    setPaidBy(event.target.value);
    const balance = userBalances[event.target.value];
    setAmount(balance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const participantIds = [];
      const description = "Settle Up"
      participantIds.push(paidBy);
      participantIds.push(selectedFriend);
      const split = 3
      if(paidBy == loggedUser.id){
        2
      }
      const response = await fetch('/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantIds: participantIds,
          amount: amount,
          date: date,
          description: description,
          paidById: paidBy,
          split: split                 
        }),
      });

      if (response.ok) {        
        setMessage('Settle Up successfully');
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        console.error('Failed to create expense.');
        setMessage('Something went wrong, check that you have filled in everything');
      }
    } catch (error) {
      console.error('Failed to create expense.');
      setMessage('Something went wrong, check that you have filled in everything');
    }
  }

  const handleClose = () => {    
    setDate(new Date().toISOString().substr(0, 10));
    setSelectedFriend(null);
    setAmount(null);
    setPaidBy(loggedUser.id);    
    setMessage("");
    props.onHide();
};  

  function createOptionsToPay(userBalances){
    const friendships = loggedUser.friendshipsSent.concat(loggedUser.friendshipsReceived);
    return(
      <>
          {Object.entries(userBalances).map(([userId, balance]) => {
              if (balance < 0) {
                  const friend = friendships.find(friendship => friendship.receiverId == userId || friendship.senderId == userId);
                  const friendName = friend.receiverId == userId ? friend.receiverName : friend.senderName;
                  const id = friend.receiverId == userId ? friend.receiverId : friend.senderId;
                  return (
                      <option key={friend.id} value={id}>{friendName}</option>
                  );
              } else {
                  return null;
              }
          })}
      </>
      )
  }

  function createOptionsToGet(userBalances){
    const friendships = loggedUser.friendshipsSent.concat(loggedUser.friendshipsReceived);
    return(
      <>
          {Object.entries(userBalances).map(([userId, balance]) => {
              if (balance > 0) {
                  const friend = friendships.find(friendship => friendship.receiverId == userId || friendship.senderId == userId);
                  const friendName = friend?.receiverId == userId ? friend?.receiverName : friend?.senderName;
                  const id = friend?.receiverId == userId ? friend?.receiverId : friend?.senderId;
                  return (
                      <option key={friend?.id} value={id}>{friendName}</option>
                  );
              } else {
                  return null;
              }
          })}
      </>
      )
  }

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={() => {        
        setDate(new Date().toISOString().substr(0, 10));
        setSelectedFriend(null);
        setAmount(null);
        setPaidBy(loggedUser.id);
        setMessage("");
        props.onHide();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Settle Up
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
       <Form>
        <Row>
          <Col className="col-auto mt-1">
              <Form.Control as="select" value={paidBy} onChange={handlePaidByChange}>
                <option value={loggedUser.id}>You</option>  
                {createOptionsToGet(userBalances)}                
              </Form.Control>
          </Col>
          <Col className="col-auto mt-2">Paid</Col>              
          <Col className="col-auto mt-1">
              <Form.Control as="select" value={selectedFriend} onChange={handleFilterChange}>
                <option value={null}>Select a friend</option>                 
                {paidBy == loggedUser.id ? createOptionsToPay(userBalances) : <option value={loggedUser.id}>You</option>}              
              </Form.Control>
          </Col>
        </Row>     
          <FormGroup>
            <FormLabel>Amount</FormLabel>
            <Form.Control type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}/>
          </FormGroup>          
          <FormGroup>
            <FormLabel>Date</FormLabel>
            <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
          </FormGroup>                
          </Form>
            <div>{message}</div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between align-items-center">
          <div>
            <img src='/Images/TBOT.png' alt='TBOTimg' className='tbot-image'/>
          </div>
          <div>
            <Button onClick={handleSubmit}>Submit</Button>                
          </div>
          <div>
          <Button onClick={handleClose}>Close</Button>
          </div>
        </Modal.Footer>
    </Modal>
  );
}

export default SettleUpModal;