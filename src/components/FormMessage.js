import './FormMessage.scss';
import { useCollection } from '../hooks/useCollection';
import { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { timestamp } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useThemeContext } from '../hooks/useThemeContext';

export default function FormMessage({ doc, setShowForm, replyTo, navToInquiries }) {
  const [queryTo, setQueryTo] = useState(replyTo ? doc.approval.queryFrom : doc.requestedBy.email);
  const [query, setQuery] = useState('');
  const { documents: users } = useCollection('users');
  const { updateDocument } = useFirestore('works');
  const { user } = useAuthContext();
  const { themeMode } = useThemeContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newLog = {
      id: Math.random(),
      logDate: timestamp.fromDate(new Date()),
      approver: doc.approval.approver,
      action: 'query',
      queryFrom: user.email,
      queryTo,
      query
    }

    await updateDocument(doc.id, { 
      approval: {
        approver: doc.approval.approver,
        approvers: doc.approval.approvers,
        queryFrom: user.email,
        queryTo,
        logs: [...doc.approval.logs, newLog]
      }
    })
    setShowForm(false);
    
    if (navToInquiries) navigate('/inquiries');
    else navigate('/approvals');
  }

  return (
    <>
      <form className={`form-message ${themeMode}`} onSubmit={handleSubmit}>
        <label>
          <span className='span-to'>To</span>
        
            <select 
              name='send-to'
              onChange={e => setQueryTo(e.target.value)}
              value={queryTo}
              >
              { replyTo && 
                <option
                  value={doc.approval.queryFrom}
                >
                  { users
                    .filter(user => user.email === doc.approval.queryFrom) 
                    .map(user => `${user.firstName} ${user.lastName} | ${user.department}`)
                  }
                </option>
              }
              { !replyTo && 
                <option value={doc.requestedBy.email}>
                  {doc.requestedBy.firstName} {doc.requestedBy.lastName} (requester) | {doc.requestedBy.department}
                </option>
              }
              { !replyTo &&
                users.map((user) => (
                  <option className='all-users' key={user.email}
                    value={user.email}
                  >{`${user.firstName} ${user.lastName} | ${user.department}`}</option>
                ))
              }
            </select>
          
        </label>

        <label>
          <span>Message</span>
          <textarea 
            name='more-info-query' 
            required
            onChange={e => setQuery(e.target.value)}
            value={query}
          ></textarea>
        </label>
        
        <div className='wrapper-btn'>
          <button type='button' className='btn-details' onClick={() => setShowForm(false)}>Cancel</button>
          <button className='btn-query'>Send</button>
        </div>
      </form>
    </>
  );
}
