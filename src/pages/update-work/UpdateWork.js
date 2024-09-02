import './UpdateWork.scss';
import FormWork from '../../components/FormWork';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { useThemeContext } from '../../hooks/useThemeContext';

export default function UpdateWork() {
  const { id } = useParams();
  const { document } = useDocument('works', id);
  const { themeMode } = useThemeContext();


  return (
    <div className={`update-work ${themeMode}`}>
      <FormWork document={document} id={id} />
    </div>
  )
}