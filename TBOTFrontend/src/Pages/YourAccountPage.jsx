import { useState, useEffect } from "react";
import Navbar from '../Components/Navbar';
import { Container, Row, Col, Button} from 'react-bootstrap';
import { useLoggedUser } from '../Services/LoggedUserProvider';

function YourAccountPage(){
    const { loggedUser, setLoggedUser } = useLoggedUser();

    return (
        <>
        <Navbar/>
            <Container className='mt-3 text-white'>
                <Container style={{backgroundColor: '#067f99', borderRadius: '6px', border: '1px solid black'}}>
                    <Row style={{height: '91vh'}}>
                        <Col xs={6} md={6} lg={6}>
                            <div className="align-items-center justify-content-center text-center" style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <img src='/src/Images/954.jpg' alt='profil' className='profil-image' style={{ maxWidth: '100%', maxHeight: '100%' }}/>
                            </div>                            
                        </Col>
                        <Col xs={6} md={6} lg={6}>
                            <div className="align-items-center justify-content-center " style={{width: '50%', margin: 8}}>
                                <p>Username: {loggedUser.username}</p>                                
                                <p>Email: {loggedUser.email}</p>                                
                            </div>                            
                        </Col>
                    </Row>
                </Container>
            </Container>
        </>
    );
}

export default YourAccountPage;