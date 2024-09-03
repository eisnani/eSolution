import { useRef, useState } from 'react';
import { useDocument } from '../../hooks/useDocument';
import { useAuthContext } from '../../hooks/useAuthContext';
import closeIcon from '../../assets/close.svg';
import { useNavigate, useParams } from 'react-router-dom';
import FormMessage from '../../components/FormMessage';
import ActionButton from '../../components/ActionButton';
import { useThemeContext } from '../../hooks/useThemeContext';
import Work from '../../components/Work';
import Approval from '../../components/Approval';
import ApprovalCycle from '../../components/ApprovalCycle';

export default function WorkDetails() {
  const [showForm, setShowForm] = useState(false);
  const { id } = useParams();
  const { document } = useDocument('works', id);
  const { modalMode, themeMode } = useThemeContext();

  const { user } = useAuthContext();
  const navigate = useNavigate();
  const formWrapperRef = useRef();

  const handleClick = (e) => {
    e.stopPropagation();

    setShowForm(true);
    setTimeout(() => formWrapperRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
  }

  return (
    <>
      { document && 
        ( document.approval.approver === user.email && 

          <section className={`work-details ${modalMode} ${themeMode}`}>
            <div className='wrapper-img'>
              <img 
                src={closeIcon} alt="icon" 
                onClick={() => navigate('/approvals')}
              />
            </div>

            <div className='work-container'>
              <Work document={document} />

              <div className="container-btn">
                { !showForm && 
                  <>
                    <ActionButton doc={document} /> 
                    <button className='btn-details' onClick={handleClick}>Send query</button>
                  </>
                }
                { showForm && <button style={{cursor: 'none'}} className='btn-details clicked' disabled>QUERY</button> }
              </div>

              { showForm &&    
                <div ref={formWrapperRef} className="form-wrapper">
                  <FormMessage doc={document} setShowForm={setShowForm} /> 
                </div>
              }

              <h4 className='h4-heading process-heading'>Approval Cycle</h4>
              <ApprovalCycle document={document} />

              <h4 className='h4-heading mb-2r'>Approval History</h4>
              <Approval document={document} user={user} />
            </div>
          </section>
        )
      }
    </>
  );
}
