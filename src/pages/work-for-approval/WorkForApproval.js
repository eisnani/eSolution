import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useThemeContext } from '../../hooks/useThemeContext';
import { useQueryFn } from '../../hooks/useQueryFn';
import SectionContainer from '../../components/SectionContainer';
import ActionButton from '../../components/ActionButton';
import WorkDetails from './WorkDetails';
import './WorkForApproval.scss';

export default function WorkForApproval() {
  const { documents, error, isPending } = useCollection('works');
  const { user } = useAuthContext();
  const { themeMode } = useThemeContext();
  const { query } = useQueryFn();
  const navigate = useNavigate();

  const forApprovals = documents.filter(doc => doc.approval.approver === user.email);
  const data = query ?
    forApprovals.filter(doc => doc.title.toLowerCase().includes(query.toLowerCase())) :
    forApprovals;

  const handleClick = (e, id) => {
    e.stopPropagation();
    navigate(`/approvals/details/${id}`);
  }

  return (
      <SectionContainer 
        isPending={isPending} 
        error={error} query={query} 
        data={data} 
        resetPath={'/approvals'}
        itemCount={forApprovals.length}
        heading={'For approvals'}
        fallbackMsg={'You currently have no item for approval.'}
        >
        <table className={themeMode}>
          <thead>
            <tr>
              <th>Request</th>
              <th className='department'>Department</th>
              <th>Due date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((doc) => (
                <tr key={doc.id}>
                  <td className='title'>{doc.title.charAt(0).toUpperCase() + doc.title.slice(1)}</td>
                  <td className='department dep-sm-device'>{doc.requestedBy.department}</td>
                  <td className={doc.dueDate.toDate() < (new Date()) ? 'overdue' : ''}
                    >{doc.dueDate.toDate().toDateString()}
                  </td>
                  <td className='btn-cell'>
                    <span className='action-btn'>
                      <ActionButton doc={doc} showLinkWork={true} />
                    </span>
                    <button className='btn-details' onClick={(e) => handleClick(e, doc.id)}>More details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          <tfoot></tfoot>
        </table>
      
      <Routes>
        <Route path='/details/:id' element={user ? <WorkDetails /> : <Navigate to='/login' />}/>
      </Routes>
    </SectionContainer>
  );
}
