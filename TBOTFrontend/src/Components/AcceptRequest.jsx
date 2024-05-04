import {Tooltip, OverlayTrigger} from 'react-bootstrap';

function AcceptRequest({ onClick }){
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Accept Request
        </Tooltip>
      );

return(
    <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
        <img src='/src/Images/accept.png' alt="Logout" className="icon-buttons" onClick={onClick}/>
    </OverlayTrigger>
)
}

export default AcceptRequest;