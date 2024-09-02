import './WorkList.scss';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import WorkStatus from './WorkStatus';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import closeIcon from '../../assets/close_small.svg'
import { useThemeContext } from '../../hooks/useThemeContext';

export default function WorkList() {
  const { documents, error, isPending } = useCollection('works');
  const { user } = useAuthContext();
  const { themeMode } = useThemeContext();

  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const query = queryParams.get('q');

  const navigate = useNavigate();

  const myRequests = 
    query ?
    documents
      .filter(doc => doc.title.toLowerCase().includes(query.toLowerCase()))
      .filter(doc => doc.requestedBy.email === user.email) :
    documents
      .filter(doc => doc.requestedBy.email === user.email);

  const val = documents.filter(doc => doc.requestedBy.email === user.email).length;

  const handleClick = (e, id) => {
    e.stopPropagation();
    navigate(`/requests/status/${id}`);
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/update-request/${id}`);
  }

  const handleReset = (e) => {
    e.stopPropagation();
    navigate(`/requests`);
  }

  return (
    <div className={`work-list ${themeMode}`}>
      { isPending && <Loader /> }
        <div className='cont-keyword'>
          { query && 
            <>
              <img onClick={handleReset} src={closeIcon} alt="icon"/>
              <p>Keyword: "<b>{query}</b>" {myRequests.length === 0 && <span>has no match.</span>}</p>
            </>
          }
        </div> 
      { !error && !isPending && myRequests.length > 0 &&
        <div className='cont-wl'>
          <h3 className='wl-heading'>My requests</h3>
            <table className={themeMode}>
              <thead>
                <tr>
                  <th>Request</th>
                  <th className='due-date'>Due date</th>
                  <th className='status'>Status</th>
                  <th>View</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                { myRequests
                  .sort((a, b) => a.createdAt - b.createdAt)
                  .map(doc => (
                  <tr key={doc.id}>
                    <td>{doc.title.charAt(0).toUpperCase() + doc.title.slice(1)}</td>
                    <td className={doc.dueDate.toDate() < (new Date()) ? 'due-date overdue' : 'due-date'}
                      >{doc.dueDate.toDate().toDateString()}
                    </td>
                    <td className='status'>
                      <span 
                        className={
                          doc.approval.approver === 'approved' ? 'approved' : 
                          doc.approval.approver === 'declined' ? 'declined' : ''
                        }
                        >{ 
                          doc.approval.approver === 'approved' ? 'Approved' : 
                          doc.approval.approver === 'declined' ? 'Declined' : 
                          'In progress'
                        }
                      </span>
                    </td>
                    <td>
                      <button className='btn-details' onClick={(e) => handleClick(e, doc.id)}>Status</button>
                    </td>
                    <td>
                      <button className='btn-details' onClick={(e) => handleEdit(e, doc.id)}>Edit</button>
                    </td>
                  </tr>
                  )) 
                }
              </tbody>
              <tfoot></tfoot>
            </table>
        </div>
      }
      { !error && !isPending && myRequests.length === 0 && !val && <p className='cont-wl'>You currently have no request.</p> }
      { error && <p className="error">{error}</p> }
      <Routes>
        <Route path='/status/:id' element={ user ? <WorkStatus user={user} /> : <Navigate to='/login' /> }/>
      </Routes>
    </div>
  )
}