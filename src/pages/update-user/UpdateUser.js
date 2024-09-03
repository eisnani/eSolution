import './UpdateUser.scss';
import FormUser from '../../components/FormUser';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { useThemeContext } from '../../hooks/useThemeContext';

export default function UpdateUser() {
  const { id } = useParams();
  const { document, error } = useDocument('users', id);
  const { themeMode } = useThemeContext();

  if (error) return <p className="error">{error}</p>

  return (
    <div className={`update-user ${themeMode}`}>
      <FormUser id={id} user={document} />
    </div>
  )
}