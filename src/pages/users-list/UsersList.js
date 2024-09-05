import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext'; 
import { useFirestore } from '../../hooks/useFirestore';
import { useThemeContext } from '../../hooks/useThemeContext';
import { useQueryFn } from '../../hooks/useQueryFn';
import Modal from '../../components/Modal';
import SectionContainer from '../../components/SectionContainer';
import './UsersList.scss';

export default function UsersList() {
  const { documents, isPending, error } = useCollection('users');
  const { deleteDocument } = useFirestore('users');
  const [Id, setId] = useState('');
  const { isAdmin } = useAuthContext();
  const { themeMode } = useThemeContext();
  const { query } = useQueryFn();

  const modalRef = useRef();

  const users = query ? 
    documents
      .filter(user => 
        user.firstName.toLowerCase().includes(query.toLowerCase()) ||  
        user.lastName.toLowerCase().includes(query.toLowerCase())) :
    documents;

  function handleInitiateDelete(e, id) {
    e.stopPropagation();
    modalRef.current.showModal();
    setId(id)
  }

  async function handleConfirmDelete(id) {
    await deleteDocument(id);
    modalRef.current.close();
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
                      <button className='btn-delete' onClick={(e) => handleInitiateDelete(e, user.id)}>Delete</button>
                    </span>
                  </td>
                }
              </tr>
            )) 
          }
        </tbody>
        <tfoot></tfoot>
      </table>
      <Modal 
        modalRef={modalRef}
        onConfirm={handleConfirmDelete}
        id={Id}
        text={'Are you sure you want to proceed with deletion?'}
        confirmBtnCaption={'Yes'}
        dismissBtnCaption={'No'}
      />
    </SectionContainer>
  )
}