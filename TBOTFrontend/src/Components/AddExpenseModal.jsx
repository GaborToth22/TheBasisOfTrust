import {Modal, Button, Form, FormGroup, FormLabel, Row, Col  } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useLoggedUser } from '../Services/LoggedUserProvider';
import DeleteFriend from './DeleteFriend';
import AddFriend from './AddFriend';

function AddExpenseModal(props) {
  const { loggedUser, setLoggedUser } = useLoggedUser();
  const [participants, setParticipants] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [paidBy, setPaidBy] = useState(loggedUser.id);
  const [split, setSplit] = useState(1);
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState([]);
  
  useEffect(() => {   
    checkPaidByOptions(participants);        
}, [loggedUser, participants]);

  const handleFilterChange = (event) => {
    const inputValue = event.target.value.toLowerCase();
    const filtered = loggedUser.friendshipsSent
        .concat(loggedUser.friendshipsReceived)
        .filter(friendship => friendship.accepted)
        .filter(friendship => { 
          const name = (loggedUser.id === friendship.senderId) ? friendship.receiverName : friendship.senderName;
          return !participants.includes(friendship) && name.toLowerCase().includes(inputValue);
        });
    setFilter(inputValue);
    setFilteredFriends(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const participantIds = participants.map(friendship => friendship.senderName === null ? friendship.receiverId : friendship.senderId);
      participantIds.push(loggedUser.id);
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
        console.log('Expense successfully created.');
        setMessage('Expense successfully created.');
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
    setFilter("");
    setDate(new Date().toISOString().substr(0, 10));
    setParticipants([]);
    setAmount(null);
    setSplit(1);
    setPaidBy(loggedUser.id);
    setDescription("");
    setMessage("");
    props.onHide();
  };

  const addParticipant = (friendship) => {
    if (!participants.some(participant => participant.id === friendship.id)) {
      setParticipants([...participants, friendship]);
      setFilter("");
    }
  }

  const removeParticipant = (friendshipId) => {
    const updatedParticipants = participants.filter(participant => participant.id !== friendshipId);
    setParticipants(updatedParticipants);
  }

 async function checkPaidByOptions(participants){
    const participantsIds = participants.map(p => p.senderName === null ? p.receiverId : p.senderId);
  
  try {
    const response = await fetch('/friendship/checkPaidBy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(participantsIds)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch paid by options');
    }

    const users = await response.json();
    setOptions(users);
  } catch (error) {
    console.error('Error fetching paid by options:', error);
    return [];
  }
    }    
    function renderOptions(users){
    return users.map(user => (
      <option key={user.id} value={user.id}>
          {user.username}
      </option>
  ));
  }
  
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={() => {
        setFilter("");
        setDate(new Date().toISOString().substr(0, 10));
        setParticipants([]);
        setAmount(null);
        setSplit(1);
        setPaidBy(loggedUser.id);
        setDescription("");
        setMessage("");
        props.onHide();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add an Expense
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
       <Form>
          <FormGroup>
            <FormLabel>With you and: 
              {participants.length > 0 && (
                <span>
                  {participants.map((result, index) => (
                    <span key={index}>{result.receiverName === null ? " " + result.senderName : " " + result.receiverName}<DeleteFriend invertFilter={false} text={"Remove from Expense"} onClick={() => removeParticipant(result.id)}/></span>
                  ))}
                </span>
              )}</FormLabel>
          </FormGroup>              
          <Form.Group>
            <Form.Control type="text" placeholder="Search friends" value={filter} onChange={handleFilterChange}/>
            {filter != "" && filteredFriends.length > 0 && (
                <div>
                    {filteredFriends.map((result, index) => (
                        <div key={index}><AddFriend invertFilter={false} text={"+Add to Expense"} onClick={() => addParticipant(result)}/>{result.receiverName === null ? result.senderName : result.receiverName}</div>
                    ))}
                </div>
            )}
          </Form.Group>
          <FormGroup>
            <FormLabel>Description</FormLabel>
            <Form.Control type="text" placeholder="Enter a description" value={description} onChange={(e) => setDescription(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <FormLabel>Amount</FormLabel>
            <Form.Control type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Row>
              {split == 1 ? (
              <>
              <FormLabel className="col-2 mt-2">Paid by:</FormLabel>
              <Col className="col-auto mt-1">
                <Form.Select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
                  <option value={loggedUser.id}>You</option>
                  {renderOptions(options)}
                </Form.Select>
              </Col>
              <Col className="col-2 mt-2">Split:</Col>
              <Col className="col-auto mt-1">
              <Form.Select value={split} onChange={(e) => {
                setSplit(e.target.value);
                if (e.target.value == 2 && participants.length === 1) {
                  setPaidBy(participants[0].senderName === null ? participants[0].receiverId : participants[0].senderId);
                } else if (e.target.value == 3) {
                  setPaidBy(loggedUser.id);
                }
              }}>
                <option value={1}>Equally</option>
                {participants.length === 1 && (
                  <>
                  <option value={2}>You Owe</option>
                  <option value={3}>Owes You</option>
                  </>
                )}        
              </Form.Select>
              </Col></>
              ) : 
              split == 3 && participants.length === 1 ? (
                <>
              <Col className="col-auto mt-2">
                <span>{participants[0].senderName === null ? participants[0].receiverName : participants[0].senderName}</span>
              </Col>
              <Col className="col-auto mt-1">
              <Form.Select value={split} onChange={(e) => {
                setSplit(e.target.value);
                if (e.target.value == 2 && participants.length === 1) {
                  setPaidBy(participants[0].senderName === null ? participants[0].receiverId : participants[0].senderId);
                } else if (e.target.value == 3 && participants.length === 1) {
                  setPaidBy(loggedUser.id);
                }
              }}>
                <option value={1}>Equally</option>
                {participants.length === 1 && (
                  <>
                  <option value={2}>You Owe</option>
                  <option value={3}>Owes You</option>
                  </>
                )}        
              </Form.Select>
              </Col>
              <Col className="col-auto mt-2">
                <span> with the full amount {amount}</span>   
              </Col>
              </>
              ): 
              split == 2 && participants.length === 1 ? (
                <>
                <Col className="col-auto mt-1">
                <Form.Select value={split} onChange={(e) => {
                setSplit(e.target.value);
                if (e.target.value == 2 && participants.length === 1) {
                  setPaidBy(participants[0].senderName === null ? participants[0].receiverId : participants[0].senderId);
                } else if (e.target.value == 3 && participants.length === 1) {
                  setPaidBy(loggedUser.id);
                }
              }}>
                <option value={1}>Equally</option>
                {participants.length === 1 && (
                  <>
                  <option value={2}>You Owe</option>
                  <option value={3}>Owes You</option>
                  </>
                )}        
              </Form.Select>
                </Col>
                <Col className="col-auto mt-2">
                  <span>{participants[0].senderName === null ? participants[0].receiverName : participants[0].senderName}</span>
                </Col>
                <Col className="col-auto mt-2">
                  <span> with the full amount {amount}</span>   
                </Col>
                </>
                ): null
              }
            </Row>
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
            <img src='/src/Images/TBOT.png' alt='TBOTimg' className='tbot-image'/>
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

export default AddExpenseModal;