import './ApprovalCycle.scss';
import { useCollection } from '../hooks/useCollection';

export default function ApprovalCycle({ document }) {
  const { documents: users } = useCollection('users');

  let approvers = [];
  document.approval.approvers.forEach(approver => approvers.push(...users.filter(user => user.email === approver)));

  return (
    <div className='approval-cycle'>
      { approvers && approvers.map(a => (
        <li key={a.email}><span className={a.email === document.approval.approver ? 'current' : ''}>{a.department}</span></li>
      ))}
      { document.approval.approver === 'approved' && <li><span className='approved'>Approved</span></li>}
      { document.approval.approver === 'declined' && <li><span className='declined'>Declined</span></li>}
    </div>
  )
}