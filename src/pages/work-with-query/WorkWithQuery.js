import './WorkWithQuery.scss';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import QueryDetails from './QueryDetails';
import closeIcon from '../../assets/close_small.svg';
import Loader from '../../components/Loader';

export default function WorkWithQuery() {
  const { documents, error, isPending } = useCollection('works');
  const { documents: users } = useCollection('users');
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const _query = queryParams.get('q');
  
  const query = 
    _query ?
    documents
    .filter(doc => doc.title.toLowerCase().includes(_query.toLowerCase()))
    .filter(doc => doc.approval.queryTo === user.email) :

    documents
      .filter(doc => doc.approval.queryTo === user.email);

  const val = documents.filter(doc => doc.approval.queryTo === user.email).length;

  const handleClick = (e, id) => {
    e.stopPropagation();
    navigate(`/inquiries/details/${id}`);
  }

  const handleReset = (e) => {
    e.stopPropagation();
    navigate(`/inquiries`);
  }

  return (
    <div className='work-with-query'>
      { isPending && <Loader /> }
      <div className='cont-keyword'>
        { _query && 
          <>
            <img onClick={handleReset} src={closeIcon} alt="icon"/>
            <p>Keyword: "<b>{_query}</b>" {query.length === 0 && <span>has no match.</span>}</p>
          </>
        }
      </div>
      { !error && !isPending && query.length > 0 &&
        <div className='cont-wwq'>
          <h3 className='wwq-heading'>Inquiries</h3>
            <table>
              <thead>
                <tr>
                  <th>Request</th>
                  <th className='due-date'>Due date</th>
                  <th>Inquiry From</th>
                  <th>Inquiry</th>
                </tr>
              </thead>
              <tbody>
                { query.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <span>{doc.title.charAt(0).toUpperCase() + doc.title.slice(1)}</span>  
                    </td>
                    <td className={doc.dueDate.toDate() < (new Date()) ? 'due-date overdue' : 'due-date'}
                      >{doc.dueDate.toDate().toDateString()}
                    </td>

                    <td className='query-from'>{ users.filter(user => user.email === doc.approval.queryFrom).map(user => `${user.firstName} ${user.lastName}`) }</td>
                      
                    <td className='btn-cell-query'>
                      <button className="btn-details" onClick={(e) => handleClick(e, doc.id)}>Open</button>
                    </td>
                      
                  </tr>
                )) }
              </tbody>
              <tfoot></tfoot>
            </table>
        </div>
      }
      { !error && !isPending && query.length === 0 && !val && <p className='cont-wwq'>You currently have no inquiry.</p> }
      { error && <p className="error">{error}</p> }
      <Routes>
        <Route path='/details/:id' element={ user ? <QueryDetails /> : <Navigate to='/login' /> } />
      </Routes>
    </div>
  )
}