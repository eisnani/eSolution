import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';

import './WorkWithQuery.scss';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useThemeContext } from '../../hooks/useThemeContext'; 
import { useQueryFn } from '../../hooks/useQueryFn';
import SectionContainer from '../../components/SectionContainer';
import QueryDetails from './QueryDetails';

export default function WorkWithQuery() {
  const { documents, error, isPending } = useCollection('works');
  const { documents: users } = useCollection('users');
  const { user } = useAuthContext();
  const { themeMode } = useThemeContext();
  const { query } = useQueryFn();
  const navigate = useNavigate();

  const dataQuery = documents.filter(doc => doc.approval.queryTo === user.email);
  
  const data = query ?
    dataQuery.filter(doc => doc.title.toLowerCase().includes(query.toLowerCase())) :
    dataQuery;

  const handleClick = (e, id) => {
    e.stopPropagation();
    navigate(`/inquiries/details/${id}`);
  }

  return (
    <SectionContainer
      isPending={isPending} 
      error={error} query={query} 
      data={data} 
      resetPath={'/inquiries'}
      itemCount={dataQuery.length}
      heading={'Inquiries'}
      fallbackMsg={'You currently have no inquiry.'}
    >
      <table className={themeMode}>
        <thead>
          <tr>
            <th>Request</th>
            <th className='due-date'>Due date</th>
            <th>Inquiry From</th>
            <th>Inquiry</th>
          </tr>
        </thead>
        <tbody>
          { data.map(doc => (
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
  
      <Routes>
        <Route path='/details/:id' element={ user ? <QueryDetails /> : <Navigate to='/login' /> } />
      </Routes>
    </SectionContainer>
  )
}