import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import WorkDetails from './WorkDetails';
import ActionButton from '../../components/ActionButton';
import './WorkForApproval.scss';
import closeIcon from '../../assets/close_small.svg';
import Loader from '../../components/Loader';

export default function WorkForApproval() {
  const { documents, error, isPending } = useCollection('works');
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const query = queryParams.get('q');

  const forApproval = 
    query ?
    documents
      .filter(doc => doc.title.toLowerCase().includes(query.toLowerCase()))
      .filter(doc => doc.approval.approver === user.email) :

    documents
      .filter(doc => doc.approval.approver === user.email);

  const val = documents.filter(doc => doc.approval.approver === user.email).length;

  const handleClick = (e, id) => {
    e.stopPropagation();
    navigate(`/approvals/details/${id}`);
  }

  const handleReset = (e) => {
    e.stopPropagation();
    navigate(`/approvals`);
  }

  return (
    <div className='work-for-approval'>
      { isPending && <Loader /> }
      <div className='cont-keyword'>
        { query && 
          <>
            <img onClick={handleReset} src={closeIcon} alt="icon"/>
            <p>Keyword: "<b>{query}</b>" {forApproval.length === 0 && <span>has no match.</span>}</p>
          </>
        }
      </div> 
      { !error && !isPending && forApproval.length > 0 &&
        <div className="cont-wfa">
          <h3 className='wfa-heading'>For approvals</h3>
          <table>
              <thead>
                <tr>
                  <th>Request</th>
                  <th className='department'>Department</th>
                  <th>Due date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {forApproval
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
        </div>
      }
      { !error && !isPending && forApproval.length === 0 && !val && <p className='cont-wfa'>You currently have no item for approval.</p> }
      { error && <p className="error">{error}</p> }
      <Routes>
        <Route path='/details/:id' element={user ? <WorkDetails /> : <Navigate to='/login' />}/>
      </Routes>
    </div>
  );
}
