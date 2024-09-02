import './UpdateUser.scss';
import FormUser from '../../components/FormUser';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';

export default function UpdateUser() {
  const { id } = useParams();
  const { document, error } = useDocument('users', id);

  if (error) return <p className="error">{error}</p>

  return (
    <div className='update-user'>
      <FormUser id={id} user={document} />
    </div>
  )
}