import { useRef } from 'react';
import FormWork from '../../components/FormWork';
import Modal from '../../components/Modal';
import { useThemeContext } from '../../hooks/useThemeContext';
import './CreateWork.scss';

export default function CreateWork() {
  const { themeMode } = useThemeContext();

  const modalRef = useRef();

  function handleShowModal() {
    modalRef.current.showModal();
    setTimeout(() => modalRef.current.close(), 1500);
  }

  return (
    <div className={`create-work ${themeMode}`}> 
      <FormWork isShowModal={handleShowModal} />
      <Modal 
        modalRef={modalRef}
        text={'The request is submitted.'}
      />
    </div>
  );
};
