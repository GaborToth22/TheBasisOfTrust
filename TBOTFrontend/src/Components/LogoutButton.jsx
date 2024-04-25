import {Tooltip, OverlayTrigger} from 'react-bootstrap';

function LogoutButton({ handleLogout }){
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Logout
        </Tooltip>
      );

return(
    <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
        <img src='/src/Images/logout.png' alt="Logout" className="logout-image" onClick={handleLogout}/>
    </OverlayTrigger>
)
}

export default LogoutButton;