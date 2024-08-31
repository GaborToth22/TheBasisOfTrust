import {Tooltip, OverlayTrigger} from 'react-bootstrap';

function DeleteFriend({ onClick, text, invertFilter = true }){
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          {text}
        </Tooltip>
      );

return(
    <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
        <img src='/Images/decline.png' alt="Delete" onClick={onClick} className="icon-buttons" style={{ filter: invertFilter ? 'invert(100%)' : 'none' }} />
    </OverlayTrigger>
    );
}

export default DeleteFriend;