import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form, FormGroup, FormLabel } from 'react-bootstrap';
import RegistrationModal from '../Components/RegistrationModal';
import { useLoggedUser } from '../Services/LoggedUserProvider';

function LoginPage(){
    const navigate = useNavigate();
    const [modalShow, setModalShow] = React.useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const { loggedUser, setLoggedUser } = useLoggedUser()

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const loginResponse = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });            

            if (loginResponse.ok ) {
                setLoginError("")
                const userDataResponse = await fetch(`/users/username/${username}`);
                const userData = await userDataResponse.json();
                await setLoggedUser(userData);
                console.log('User successfully logged in.');
                console.log(userData);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setLoginError('Invalid username or password. Please try agagin.');
                console.error('Invalid username or password during login.');
            }
        } catch (error) {
            setLoginError('Invalid username or password. Please try agagin.');
            console.error('Invalid username or password during login.');
        }
    }  

    return (
         <Container className='d-flex justify-content-center align-items-center custom-container text-white' style={{ minHeight: '100vh' }}>
            {loggedUser ? (
                <>
                    <h2>Welcome, {username}</h2>                 
                </>
            ) : (
                <Form>
                    <Row className='justify-content-center text-center'>
                        <Col xs={12} md={12} lg={12}>
                            <h3>The Basis Of Trust please log in.</h3>                            
                        </Col>
                    </Row>
                    <Row className='justify-content-center text-center'>
                        <Col xs={10} md={6} lg={6}>
                        <FormGroup>
                            <FormLabel>Username</FormLabel>
                            <Form.Control type="text" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </FormGroup>
                        </Col>
                        <Col xs={10} md={6} lg={6}>
                        <FormGroup>
                            <FormLabel>Password</FormLabel>
                            <Form.Control type="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)}/>  
                            <Form.Text className='text-white'>
                                Your at least 6 characters long password.
                            </Form.Text>                          
                        </FormGroup>
                        </Col>
                    </Row>      
                    <Row className='justify-content-center text-center'>
                        <Col xs={12} md={12} lg={12}>
                            <p>{loginError}</p>
                        </Col>
                    </Row>
                    <Row className='justify-content-center'>
                        <Col xs={4} md={4} lg={4}>
                            <Button variant='primary' type='submit' onClick={handleLoginSubmit} className='w-100 mb-3 mt-3'>Login</Button>
                        </Col>
                    </Row>              
                    <Row className='justify-content-center text-center'>
                        <Col>
                            <p>Not a member yet? <span onClick={() => setModalShow(true)} style={{ textDecoration: "underline", cursor: "pointer" }}>Click here to Register</span></p>
                        </Col>
                    </Row> 
                    <img src='/src/Images/TBOT.png' alt='TBOTimg' className='tbot-image'/>
                    <RegistrationModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}/>
                </Form>
            )}
        </Container>
    );
}

export default LoginPage;