import {Tooltip, OverlayTrigger} from 'react-bootstrap';

function SendFriendRequest({ onClick }){
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Send Friend Request
        </Tooltip>
      );

return(
    <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
        <img src='/src/Images/addIcon.png' alt="SendRequest" className="sendRequest-button" onClick={onClick} />
    </OverlayTrigger>
)
}

export default SendFriendRequest;