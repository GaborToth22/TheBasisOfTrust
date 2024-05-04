import {Tooltip, OverlayTrigger} from 'react-bootstrap';

function AddFriend({ onClick }){
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          +Add Friend
        </Tooltip>
      );

return(
    <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
        <img src='/src/Images/addIcon.png' alt="AddFriend" className="icon-buttons" onClick={onClick} />
    </OverlayTrigger>
)
}

export default AddFriend;