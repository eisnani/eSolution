import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext'; 
import { useThemeContext } from '../../hooks/useThemeContext';
import Loader from '../../components/Loader';
import Backdrop from '../../components/Backdrop';
import Modal from '../../components/Modal';
import closeIcon from '../../assets/close_small.svg';
import './UsersList.scss';

export default function UsersList() {
  const [showModal, setShowModal] = useState(false);
  const { documents, isPending, error } = useCollection('users');
  const [userId, setUserId] = useState('');
  const { isAdmin } = useAuthContext();
  const { themeMode } = useThemeContext();
  const navigate = useNavigate();

  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const query = queryParams.get('q');

  const users = 
    query ? 
    documents
      .filter(user => 
        user.firstName.toLowerCase().includes(query.toLowerCase()) ||  
        user.lastName.toLowerCase().includes(query.toLowerCase())) :
        
    documents;

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setShowModal(true);
    setUserId(id);
  }

  const handleReset = (e) => {
    e.stopPropagation();
    navigate(`/users`);
  }

  return (
    <div className={`users-list ${themeMode}`}>
      { isPending && <Loader /> }
      <div className='cont-keyword'>
        { query && 
          <>
            <img onClick={handleReset} src={closeIcon} alt="icon"/>
            <p>Keyword: "<b>{query}</b>" {users.length === 0 && <span>has no match.</span>}</p>
          </>
        }
      </div> 
      { !error && !isPending && users.length > 0 && 
        <div className={`table-container ${themeMode}`}>
          <h3 className='ul-heading'>Users</h3>
            <table className={themeMode}>
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Name</th>
                  <th className='designation'>Designation</th>
                  <th>Department</th>
                  <th className='user-email'>Email</th>
                  { isAdmin && 
                    <th>Update/ Delete</th>
                  }
                </tr>
              </thead>
              <tbody>
                { users
                  .map((user, key) => (
                    <tr key={user.id}>
                      <td>{ key += 1 }</td>
                      <td className='user user-list'>{`${user.firstName} ${user.lastName}`}</td>
                      <td className='designation des-sm-device'>{user.designation}</td>
                      <td className='department'>{user.department}</td>
                      <td className='user-email'>{user.email}</td>
                      { isAdmin && 
                        <td>
                          <span className='user-list-btn-wrap'>
                            <Link className='btn-link' to={`/update-user/${user.id}`}>Update</Link>
                            <button className='btn-delete' onClick={(e) => handleDelete(e, user.id)}>Delete</button>
                          </span>
                        </td>
                      }
                    </tr>
                  )) 
                }
              </tbody>
              <tfoot></tfoot>
            </table>
        </div>
      }
      { !error && !isPending && users.length === 0 && !documents && <p>No user currently on record.</p> }
      { error && <p className='error'>{error}</p> }
      { showModal &&  
        <>
          <Backdrop />
          <Modal 
            message={'Please confirm user deletion.'} 
            userId={userId}
            setShowModal={setShowModal}
          />
        </>
      }
    </div>
  )
}