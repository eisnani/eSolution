import { useRef } from 'react';

import { useThemeContext } from '../../hooks/useThemeContext';
import FormUser from '../../components/FormUser';
import Modal from '../../components/Modal';
import './CreateUser.scss';

export default function CreateUser() {
  const { themeMode } = useThemeContext();

  const modalRef = useRef();

  function handleShowModal() {
    modalRef.current.showModal();
    setTimeout(() => modalRef.current.close(), 1500);
  }

  return (
    <div className={`create-user ${themeMode}`}>
      <FormUser isShowModal={handleShowModal} />

      <Modal 
        modalRef={modalRef}
        text={'The user is created.'}
      />
    </div>
  )
}