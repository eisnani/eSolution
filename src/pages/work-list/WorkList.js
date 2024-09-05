import {  useRef, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import { useCollection } from '../../hooks/useCollection';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useThemeContext } from '../../hooks/useThemeContext';
import { useQueryFn } from '../../hooks/useQueryFn';
import WorkStatus from './WorkStatus';
import SectionContainer from '../../components/SectionContainer';
import Modal from '../../components/Modal';
import './WorkList.scss';

export default function WorkList() {
  const [Id, setId] = useState('');
  const { documents, error, isPending } = useCollection('works');
  const { deleteDocument, response } = useFirestore('works');
  const { user } = useAuthContext();
  const { themeMode } = useThemeContext();
  const { query } = useQueryFn();

  const navigate = useNavigate();
  const modalActionRef = useRef();
  const modalInfoRef = useRef();

  const myRequest = documents.filter(doc => doc.requestedBy.email === user.email);

  const data = query ?
    myRequest.filter(doc => doc.title.toLowerCase().includes(query.toLowerCase())) :
    myRequest;

  const handleClick = (e, id) => {
    e.stopPropagation();
    navigate(`/requests/status/${id}`);
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/update-request/${id}`);
  }

  function handleInitiateDelete(e, id) {
    e.stopPropagation();
    modalActionRef.current.showModal();
    setId(id);
  }

  async function handleConfirmDelete(id) {
    await deleteDocument(id);
    
    if (!response.error) {
      modalInfoRef.current.showModal();
      setTimeout(() => { modalInfoRef.current.close() }, 1500);
    }
  }

  return (
    <>
      <SectionContainer
        isPending={isPending} 
        error={error} query={query} 
        data={data} 
        resetPath={'/requests'}
        itemCount={myRequest.length}
        heading={'My requests'}
        fallbackMsg={'You currently have no request.'}
      >
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
            { data
              .sort((a, b) => a.createdAt - b.createdAt)
              .map(doc => (
              <tr key={doc.id}>
                <td>{doc.title.charAt(0).toUpperCase() + doc.title.slice(1)}</td>
                <td className={doc.dueDate.toDate() < (new Date()) ? 'due-date overdue' : 'due-date'}
                  >{doc.dueDate.toDate().toDateString()}
                </td>
                <td className='status'>
                  <span className={doc.approval.approver}>
                    { 
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
                  <button className='btn-delete' onClick={(e) => handleInitiateDelete(e, doc.id)} >Delete</button>
                </td>
              </tr>
              )) 
            }
          </tbody>
          <tfoot></tfoot>
        </table>

        <Routes>
          <Route path='/status/:id' element={ user ? <WorkStatus user={user} /> : <Navigate to='/login' /> }/>
        </Routes>

        <Modal 
          modalRef={modalActionRef}
          onConfirm={handleConfirmDelete}
          id={Id}
          text={'Are you sure you want to proceed with deletion?'}
          confirmBtnCaption={'Yes'}
          dismissBtnCaption={'No'}
        />      
      </SectionContainer>

      <Modal
        modalRef={modalInfoRef}
        text={'The request is deleted.'}
      />
    </>
  )
}