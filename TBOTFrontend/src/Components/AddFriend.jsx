import {Tooltip, OverlayTrigger} from 'react-bootstrap';

function AddFriend({ onClick, text, invertFilter = true  }){
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          {text}
        </Tooltip>
      );

return(
    <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
        <img src='/src/Images/addIcon.png' alt="AddFriend" className="icon-buttons" onClick={onClick} style={{ filter: invertFilter ? 'invert(100%)' : 'none' }}/>
    </OverlayTrigger>
)
}

export default AddFriend;