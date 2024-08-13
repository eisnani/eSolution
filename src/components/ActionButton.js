import { assignApprover } from './AssignApprover.js';
import { useFirestore } from '../hooks/useFirestore.js';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { timestamp } from '../firebase/config.js';
import { useNavigate } from 'react-router-dom';

export default function ActionButton({ doc }) {
  const { updateDocument } = useFirestore('works');
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleApprove = async (type, id) => {
    const { approver, approvers } = assignApprover(type, user.email);

    const newLog = {
      id: Math.random(),
      logDate: timestamp.fromDate(new Date()),
      approver: doc.approval.approver,
      action: 'approved' 
    }
    
    await updateDocument(id, { 
      approval: {
        approver,
        approvers,
        logs: [...doc.approval.logs, newLog]
      }
    });
    
    navigate('/approvals');
  };

  const handleDecline = async (id) => {
    const newLog = {
      id: Math.random(),
      logDate: timestamp.fromDate(new Date()),
      approver: doc.approval.approver,
      action: 'declined' 
    }

    await updateDocument(id, {
      approval: {
        approver: 'declined',
        approvers: doc.approval.approvers,
        logs: [...doc.approval.logs, newLog]
      }
    });

    navigate('/approvals');
  }

  return (
    <>
      <button
        className='btn-approve'
        onClick={(e) => {
          e.stopPropagation();
          handleApprove(doc.type, doc.id)}
        }
      >
        Approve
      </button>

      <button 
        className='btn-decline'
        onClick={(e) => {
          e.stopPropagation();
          handleDecline(doc.id)}
        }
      >Decline</button> 
    </>
  );
}
