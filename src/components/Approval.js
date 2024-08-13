import './Approval.scss';
import { useCollection } from '../hooks/useCollection';

export default function Approval({ document, user: currentUser }) {
  const { documents: users } = useCollection('users')

  return (
    <>
      { document.approval.logs.length > 0 && 

        <div className='approval'>
  
          <ul className='list'>
            { document.approval.logs
              .sort((a, b) => b.logDate - a.logDate)
              .map((log) => (
                <li key={log.id}>  
                  <span>{log.logDate.toDate().toDateString()} </span> 
                  { users
                    .filter(user => user.email === (log.queryFrom || log.approver))
                    .map(user => (
                      <span key={user.email} className='from'>
                        {`[ From: `} { user.email === currentUser.email ? 'Me' :
                          <>{user.firstName} {user.lastName}<span className='user-email'> {user.email}</span></> 
                        }
                      </span>
                  ))}
                  
                  { users
                    .filter(user => user.email === log.queryTo)
                    .map(user => (
                      <span key={user.email} className='to'>
                        {` | To: `} 
                        { user.email === currentUser.email ? 'Me' : 
                          <>{user.firstName} {user.lastName}<span className='user-email'> {user.email}</span></> 
                        }
                      </span>
                    ))
                  }
                  <span>{` ]`}</span>
                  <b> {log.action}</b>
                  <em> {log.query}</em>
                </li>
              ))
            }
          </ul>
        </div>
      }
    </>

  )
}