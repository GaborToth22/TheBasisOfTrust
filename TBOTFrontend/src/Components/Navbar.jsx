import {Nav ,NavLink, NavbarText, Button, Container, Row, Col} from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import { useLoggedUser } from '../Services/LoggedUserProvider';
import LogoutButton from '../Components/LogoutButton';

function Navbar(){
    const location = useLocation();
    const { loggedUser, setLoggedUser } = useLoggedUser()
    
    const handleLogout = () => {
        fetch('/auth/logout', { 
            method: 'POST'
            })
            .then(() => {
                setLoggedUser(undefined);
            })
            .catch(err => console.error('Logout error', err));
    };

    return (
        <Container>
            <Row className="justify-content-between">
                <Col xs={4} sm={8} md={8} lg={8}>
                    <Nav variant="underline" className="justify-content-between">
                        <Nav.Item>
                            <Nav.Link href="/" className={`text-white ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/allExpenses" className={`text-white ${location.pathname === '/allExpenses' ? 'active' : ''}`}>All Expenses</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/yourAccount" className={`text-white ${location.pathname === '/yourAccount' ? 'active' : ''}`}>Your Account</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col xs={4} sm={4} md={3} lg={3}>
                    <Nav className="justify-content-between">
                    <Nav.Item className="mt-2">
                        <NavbarText className="text-white navbar-text">{loggedUser ? loggedUser.username : ''}</NavbarText>
                    </Nav.Item>
                    <Nav.Item className="mt-1">
                        <Link to="/login">
                            <LogoutButton handleLogout={handleLogout}/>
                        </Link>
                    </Nav.Item>
                    </Nav>
                </Col>
            </Row>
        </Container>
    );
}

export default Navbar;