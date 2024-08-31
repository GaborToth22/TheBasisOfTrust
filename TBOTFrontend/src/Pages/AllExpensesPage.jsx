import { useState, useEffect } from "react";
import Navbar from '../Components/Navbar';
import { Container, Row, Col, Button} from 'react-bootstrap';
import { useLoggedUser } from '../Services/LoggedUserProvider';
import AddExpenseModal from "../Components/AddExpenseModal";
import SettleUpModal from "../Components/SettleUpModal";

function AllExpensesPage(){
    const { loggedUser, setLoggedUser } = useLoggedUser();
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState(undefined);
    const [addExpenseModalShow, setAddExpenseModalShow] = useState(false);
    const [settleUpModalShow, setSettleUpModalShow] = useState(false);
    const [youOwe, setYouOwe] = useState(0);
    const [total, setTotal] = useState(0);
    const [owesYou, setOwesYou] = useState(0);
    const [userBalances, setUserBalances] = useState({});

    useEffect(() => {   
        fetchExpenses();
        fetchBalances();
    }, [loggedUser, addExpenseModalShow, settleUpModalShow]);

    useEffect(() => {
        if (balances && loggedUser) {
            const userBalances = {};
            let youOweSum = 0.00;
            let owesYouSum = 0.00;

            balances.forEach(balance => {
                const amount = balance.amount; 
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
    
    const fetchExpenses = async () => {
        try {
            const response = await fetch(`/expense/userId/${loggedUser.id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setExpenses(data);
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

    function renderExpenses(expenses) {
        const sortedExpenses = expenses.sort((a, b) => {
            const dateComparison = new Date(b.date) - new Date(a.date);
            if (dateComparison !== 0) {
              return dateComparison;
            } else {             
              return b.id - a.id;
            }
          });
        return (
            <>
                {sortedExpenses.map(expense => (
                    <Row key={expense.id} className=' text-white'>
                        <Col className="d-flex justify-content-between align-items-center" style={{borderBottom: '1px solid black'}}>
                            <div className="align-items-center justify-content-center text-center" style={{width: '25%'}}>
                                <p>{expense.date.slice(0, 10)}</p>
                            </div>
                            <div className="align-items-center justify-content-center text-center" style={{width: '25%'}}>
                                <p>{expense.description}</p>
                            </div>
                            <div className="align-items-center justify-content-center text-center" style={{width: '25%'}}>
                                <p>{expense.paidById === loggedUser.id ? 'You' : expense.participants.find(participant => participant.userId === expense.paidById).username} paid {expense.amount} </p>
                            </div>
                            <div className="align-items-center justify-content-center text-center" style={{width: '25%'}}>
                                <p className={((loggedUser.id === expense.paidById && expense.description !== "Settle Up") || (loggedUser.id !== expense.paidById && expense.description === "Settle Up")) ? "fontsGreen" : "fontsRed"}>
                                    {expense.paidById === loggedUser.id ? 
                                        (expense.description === "Settle Up" ? 
                                        (`You paid back ${expense.participants.find(participant => participant.userId !== expense.paidById).username} ${expense.amount.toFixed(2)}`) 
                                            : 
                                            (`${expense.participants
                                                .filter(participant => participant.userId !== loggedUser.id)
                                                .map((participant, index, array) => 
                                                    index === array.length - 1 ? participant.username : participant.username 
                                                )
                                                .join(', ')
                                                .replace(/,([^,]*)$/, ' and$1')} owes You with ${(expense.amount / expense.participants.length).toFixed(2)}`))  
                                    :
                                        (expense.description === "Settle Up" ? 
                                        (`${expense.participants
                                            .filter(participant => participant.userId !== loggedUser.id)
                                            .map((participant, index, array) => 
                                                index === array.length - 1 ? participant.username : participant.username 
                                            )
                                            .join(', ')
                                            .replace(/,([^,]*)$/, ' and$1')} paid back You ${expense.amount}`)
                                         
                                            : 
                                            (`You,  ${expense.participants
                                                .filter(participant => participant.userId !== loggedUser.id && participant.userId !== expense.paidById)
                                                .map((participant, index, array) => 
                                                    index === array.length - 1 ? participant.username : participant.username 
                                                )
                                                .join(', ')
                                                .replace(/,([^,]*)$/, ' and$1')} owe ${expense.participants.find(participant => participant.userId === expense.paidById).username} with ${expense.split == 1 ? (expense.amount/expense.participants.length).toFixed(2) : expense.amount.toFixed(2)}`)) 
                                                                }
                                </p>
                            </div>
                        </Col>
                    </Row>
                ))}
            </>
        );
    }

    return (
        <>
            <Navbar/>
            <Container className='mt-3'>
                <Container style={{backgroundColor: '#067f99', borderRadius: '6px', border: '1px solid black'}}>    
                    <Row >
                        <Col className="d-flex justify-content-between align-items-center">
                            <Button variant="warning" onClick={() => setAddExpenseModalShow(true)} style={{width: '33%'}}>Add Expense</Button>
                            <img src='/Images/TBOT.png' alt='TBOTimg' className='tbot-image'/>
                            <Button variant="success" onClick={() => setSettleUpModalShow(true)} style={{width: '33%'}}>Settle Up</Button>
                        </Col>
                    </Row>
                    <Row className=' text-white'>
                        <Col className="d-flex justify-content-between align-items-center" style={{borderTop: '1px solid black', borderBottom: '1px solid black'}}>
                            <div className="align-items-center justify-content-center text-center" style={{width: '33%'}}>
                                <p>You owe</p>
                                <p className={youOwe != 0 ? "fontsRed" : "fonts"}>{youOwe} </p>
                            </div>
                            <div className="align-items-center justify-content-center text-center" style={{width: '33%'}}>
                                <p>Total balance</p>
                                <p className={total > 0 ? "fontsGreen" : (total < 0 ? "fontsRed" : "fonts")}>{total}</p>
                            </div>
                            <div className="align-items-center justify-content-center text-center" style={{width: '33%'}}>
                                <p>You are owed</p>
                                <p className={owesYou != 0 ? "fontsGreen" : "fonts"}>{owesYou}</p>
                            </div>
                        </Col>
                    </Row>
                    <Row className=' text-white'>
                        <Col className="d-flex justify-content-between align-items-center" style={{borderBottom: '1px solid black', backgroundColor: '#065F81'}}>
                            <div className="align-items-center justify-content-center text-center" style={{width: '25%'}}>
                                <p>Date</p>
                            </div>
                            <div className="align-items-center justify-content-center text-center" style={{width: '25%'}}>
                                <p>Description</p>
                            </div>
                            <div className="align-items-center justify-content-center text-center" style={{width: '25%'}}>
                                <p>How paid?</p>
                            </div>
                            <div className="align-items-center justify-content-center text-center" style={{width: '25%'}}>
                                <p>Debt</p>
                            </div>
                        </Col>
                    </Row>
                        {renderExpenses(expenses)}
                </Container>
                <AddExpenseModal show={addExpenseModalShow} fetchUser={fetchUser} onHide={() => setAddExpenseModalShow(false)}/>
                <SettleUpModal show={settleUpModalShow} userBalances={userBalances} fetchUser={fetchUser} onHide={() => setSettleUpModalShow(false)}/>
            </Container>
        </>

    );
}

export default AllExpensesPage;