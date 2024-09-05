import { createPortal } from "react-dom";
import warningIcon from '../assets/warning.svg';
import checkIcon from '../assets/check_circle.svg';
// Styling at index.scss

export default function Modal({ modalRef, text, id, onConfirm, confirmBtnCaption, dismissBtnCaption }) {

  return createPortal ((
      <dialog ref={modalRef} className={id ? 'action' : 'info'}>
        <div className="msg-container">
          <img src={id ? warningIcon : checkIcon} alt="icon" />
          <p>{text}</p>
        </div>

        { id && 
          <form method="dialog" className="btn-container">
            <button 
              className="btn btn--secondary"
            >{dismissBtnCaption}</button>

            <button 
              onClick={() => onConfirm(id)}
              className="btn btn--danger"
            >{confirmBtnCaption}</button>
          </form>
        }
      </dialog>
    ), document.body
  )
};
