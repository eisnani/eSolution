import { useFirestore } from '../hooks/useFirestore';

export default function Modal({ message, userId, setShowModal }) {
  const { deleteDocument, response } = useFirestore('users');

  const handleConfirm = async (e) => {
    e.stopPropagation();
    await deleteDocument(userId);

    if (!response.error) setShowModal(false);
    console.log(response.error)
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setShowModal(false);
  };

  return (
    <div 
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 350,
        padding: '5rem 8rem',
        borderRadius: '3px',
        backgroundColor: 'var(--color-gray-light)',
        boxShadow: '0 .5rem .8rem rgba(0,0,0,.3)',
      }}
    >
      <p
        style={{
          fontSize: '2rem',
          textAlign: 'center',
          marginBottom: '3rem',
          color: 'var(--color-red)'
        }}
      >{response.error ? response.error : message}</p>
      <div
        style={{
          display: 'flex',
          gap: '1.5rem'
        }}
      >
        <button 
          onClick={handleConfirm}
          className="btn btn--danger"
        >Confirm</button>
        <button 
          onClick={handleCancel}
          className="btn btn--secondary"
          >Cancel</button>
      </div>
    </div>
  )
};