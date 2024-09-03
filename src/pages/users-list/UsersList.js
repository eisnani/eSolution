import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext'; 
import { useThemeContext } from '../../hooks/useThemeContext';
import Backdrop from '../../components/Backdrop';
import Modal from '../../components/Modal';
import SectionContainer from '../../components/SectionContainer';
import './UsersList.scss';

export default function UsersList() {
  const [showModal, setShowModal] = useState(false);
  const { documents, isPending, error } = useCollection('users');
  const [userId, setUserId] = useState('');
  const { isAdmin } = useAuthContext();
  const { themeMode } = useThemeContext();

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

  return (
    <SectionContainer
      isPending={isPending} 
      error={error} query={query} 
      data={users} 
      resetPath={'/users'}
      itemCount={documents}
      heading={'Users'}
      fallbackMsg={'No user currently on record.'}
    >
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
    </SectionContainer>
  )
}