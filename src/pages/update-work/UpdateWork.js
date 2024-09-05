import { useRef } from 'react';
import { useParams } from 'react-router-dom';

import FormWork from '../../components/FormWork';
import { useDocument } from '../../hooks/useDocument';
import { useThemeContext } from '../../hooks/useThemeContext';
import Modal from '../../components/Modal';
import './UpdateWork.scss';


export default function UpdateWork() {
  const { id } = useParams();
  const { document } = useDocument('works', id);
  const { themeMode } = useThemeContext();

  const modalRef = useRef();

  function handleShowModal() {
    modalRef.current.showModal();
  }

  return (
    <div className={`update-work ${themeMode}`}>
      <FormWork document={document} id={id} isShowModal={handleShowModal} />
      <Modal 
        modalRef={modalRef}
        text={'The request is updated.'}
      />
    </div>
  )
}