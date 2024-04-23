import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Popover, Form, FormGroup, FormLabel } from 'react-bootstrap';

function LoginPage({loggedUser, setLoggedUser}){
    const navigate = useNavigate();
    const [showRegistration, setShowRegistration] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(null);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });            

            if (response.ok ) {
                const response = await fetch(`/users/${username}`);
                const userData = await response.json();
                await setLoggedUser(userData);
                console.log('User successfully logged in.');
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

    const handleRegisterClick = () => {
        setShowRegistration(true);
    };

    return (
         <Container className='d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
            {loggedUser ? (
                // Show only when user is logged in
                <>
                    <h2>Welcome, {username}</h2>                    
                    <div className="cancel-button">
                        <Link to="/">
                            <button>Home</button>
                        </Link>
                    </div>
                </>
            ) : (
                // Show only when user is not logged in
                <Form>
                    <Row className='justify-content-center text-center'>
                        <Col xs={12} md={12} lg={12}>
                            <h3>The Basis Of Trust please log in.</h3>                            
                        </Col>
                    </Row>
                    <Row className='justify-content-center'>
                        <Col xs={10} md={6} lg={6}>
                        <FormGroup>
                            <FormLabel>Username</FormLabel>
                            <Form.Control type="text" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                            <Form.Text className='text-muted'>
                                We'll never share you email address, trust us!
                            </Form.Text>
                        </FormGroup>
                        </Col>
                        <Col xs={10} md={6} lg={6}>
                        <FormGroup>
                            <FormLabel>Password</FormLabel>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>                            
                        </FormGroup>
                        </Col>
                    </Row>
                    <Row className='justify-content-center'>
                        <Col xs={10} md={4} lg={3}>
                            <Button variant='primary' type='submit' onClick={handleLoginSubmit} className='w-100'>Login</Button>
                        </Col>
                    </Row>
                    <Row className='justify-content-center text-center'>
                        <Col>
                            <p>Not a member yet? <span onClick={handleRegisterClick} style={{ textDecoration: "underline", cursor: "pointer" }}>Click here to Register</span></p>
                        </Col>
                    </Row>
                        
                        
                    
                    {showRegistration && <RegistrationForm setShowRegistration={setShowRegistration} />}
                </Form>
            )}
        </Container>
    );
}

export default LoginPage;