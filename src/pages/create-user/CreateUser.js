import FormUser from '../../components/FormUser';
import './CreateUser.scss';
import { useThemeContext } from '../../hooks/useThemeContext';

export default function CreateUser() {
  const { themeMode } = useThemeContext();

  return (
    <div className={`create-user ${themeMode}`}>
      <FormUser />
    </div>
  )
}