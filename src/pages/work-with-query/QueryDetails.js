import { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useDocument } from '../../hooks/useDocument';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useThemeContext } from "../../hooks/useThemeContext";
import Approval from "../../components/Approval";
import Work from '../../components/Work';
import FormMessage from "../../components/FormMessage";
import ApprovalCycle from "../../components/ApprovalCycle";
import closeIcon from '../../assets/close.svg';

export default function QueryDetails() {
  const [showForm, setShowForm] = useState(false);
  const [replyTo, setReplyTo] = useState('');
  const { id } = useParams();
  const { document } = useDocument('works', id);
  const { user } = useAuthContext();
  const { modalMode, themeMode } = useThemeContext();
  const navigate = useNavigate();
  const formWrapperRef = useRef();

  const handleReply = (e) => {
    e.stopPropagation();

    setShowForm(true);
    setTimeout(() => formWrapperRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }) , 0);
    setReplyTo(document.approval.queryFrom);
  }

  const handleForward = (e) => {
    e.stopPropagation();

    setShowForm(true);
    setTimeout(() => formWrapperRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }) , 0);
    setReplyTo('');
  }

  return (
    <>
      { document && 
        <section className={`query-details ${modalMode} ${themeMode}`}>
          <div className='wrapper-img'>
            <img 
              src={closeIcon} alt="icon" 
              onClick={() => navigate('/inquiries')}
            />
          </div>
          <div className="work-container">
            <div className="query-container">
              <div className="que-btn-cont">
                <h2 className="query-h2">Query</h2>
                <button className={`btn-query ${replyTo && showForm ? 'clicked' : ''}`} onClick={handleReply}>Reply</button>
                <button className={`btn-approve ${!replyTo && showForm ? 'clicked' : ''}`} onClick={handleForward}>Forward</button>
              </div>

              { showForm &&    
                <div ref={formWrapperRef} className="form-wrapper">
                  <FormMessage doc={document} setShowForm={setShowForm} replyTo={replyTo} navToInquiries={true} /> 
                </div>
              }
              
              <Approval document={document} user={user} />
            </div>
          
            <Work document={document} />

            <h4 className='h4-heading mb-2r'>Approval Cycle</h4>
            <ApprovalCycle document={document} />
          </div>
        </section>
      }
    </>
  )
}