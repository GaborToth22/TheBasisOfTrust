import {Modal, Button, Form, FormGroup, FormLabel  } from 'react-bootstrap';
import React, { useState } from 'react';

function RegistrationModal(props){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [registrationMessage, setRegistrationMessage] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    username,
                    password                    
                }),
            });

            if (response.ok) {
                console.log('User successfully registered.');                
                setRegistrationMessage('Registration successful! Please proceed to log in.');
                setTimeout(() => {
                    props.onHide();
                }, 3000);

            } else {
                console.error('Registration failed.');
                setRegistrationMessage('Registration failed. Please try again!');
            }
        } catch (error) {
            console.error('Failed to register user.');
            setRegistrationMessage('Registration failed. Please try again!');
        }
    }
    return (
        <Modal
          {...props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Registration
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
           <Form>
                <FormGroup>
                    <FormLabel>Username</FormLabel>
                    <Form.Control type="text" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Email</FormLabel>
                    <Form.Control type="text" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Password</FormLabel>
                    <Form.Control type="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)}/>  
                    <Form.Text className='text-muted'>
                        Your password must be at least 6 characters.
                    </Form.Text>                          
                </FormGroup>                
           </Form>
          </Modal.Body>
            {registrationMessage && (
                <Modal.Body>
                    <p>{registrationMessage}</p>
                </Modal.Body>
            )}
          <Modal.Footer className="d-flex justify-content-between align-items-center">
            <div>
                <img src='/Images/TBOT.png' alt='TBOTimg' className='tbot-image'/>
            </div>
            <div>
                <Button onClick={handleSubmit}>Register</Button>                
            </div>
            <div>                
                <Button onClick={() => {
                    setRegistrationMessage('');
                    props.onHide();
                }}>Close</Button>
            </div>
          </Modal.Footer>
        </Modal>
      );
}

export default RegistrationModal;