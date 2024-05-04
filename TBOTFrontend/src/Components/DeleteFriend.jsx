import {Tooltip, OverlayTrigger} from 'react-bootstrap';

function DeleteFriend({ onClick }){
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Decline Friendship
        </Tooltip>
      );

return(
    <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
        <img src='/src/Images/decline.png' alt="Delete" onClick={onClick} className="icon-buttons" />
    </OverlayTrigger>
    );
}

export default DeleteFriend;