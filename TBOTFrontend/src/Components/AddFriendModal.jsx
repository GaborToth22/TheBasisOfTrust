import {Modal, Button, Form, FormGroup, FormLabel  } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { useLoggedUser } from '../Services/LoggedUserProvider';
import SendFriendRequest from './SendFriendRequest';

function AddFriendModal(props) {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState(undefined);
    const [searchResults, setSearchResults] = useState([]); 
    const [message, setMessage] = useState("");   
    const { loggedUser, setLoggedUser } = useLoggedUser();
    const { fetchUser } = props;

    useEffect(() => {   
        fetchUsers();
    }, []);    

    console.log(loggedUser.id)
    const fetchUsers = async () => {
        try {
            const response = await fetch(`/users`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching balance data:', error);
        }
    };

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearch(searchTerm);        
        let filteredResults = [];
    
        if (searchTerm.length > 0) {
            filteredResults = users.filter(user => 
                user.username.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm)
            );
        }
    
        setSearchResults(filteredResults);
    };

    const handleClose = () => {
        setSearch("");
        setSearchResults([]);
        setMessage("");
        props.onHide();
    };

    const sendRequest = async (senderId, receiverId) => {    
        console.log(senderId)    
        console.log(receiverId)    
        try {
            const response = await fetch(`/friendship/sendRequest/${senderId}/${receiverId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log(data); 
            setMessage(data.message); 
            fetchUser()           
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };    

    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => {
            setSearch("");
            setSearchResults([]);
            setMessage("");
            props.onHide();
          }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Find friends by Username or Email!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {message === "" && (
                <Form>
                    <FormGroup>
                        <FormLabel>Search Friend</FormLabel>
                        <Form.Control type="text" placeholder="Username or Email" value={search} onChange={handleSearch}/>
                    </FormGroup>       
                </Form>
            )}
            {message === "" && searchResults.length > 0 && (
                <div>
                    {searchResults.map((result, index) => (
                        <div key={index}><SendFriendRequest onClick={() => sendRequest(loggedUser.id, result.id)} />{result.username} - {result.email}</div>
                    ))}
                </div>
            )}
            {message && (
                    <p>{message}</p>
                )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  export default AddFriendModal;