import { useRef } from 'react';
import FormUser from '../../components/FormUser';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { useThemeContext } from '../../hooks/useThemeContext';
import Modal from '../../components/Modal';
import './UpdateUser.scss';

export default function UpdateUser() {
  const { id } = useParams();
  const { document, error } = useDocument('users', id);
  const { themeMode } = useThemeContext();

  const modalRef = useRef();

  function handleShowModal() {
    modalRef.current.showModal();
  }

  if (error) return <p className="error">{error}</p>

  return (
    <div className={`update-user ${themeMode}`}>
      <FormUser id={id} user={document} isShowModal={handleShowModal} />

      <Modal 
        modalRef={modalRef}
        text={'The user is updated.'}
      />
    </div>
  )
}