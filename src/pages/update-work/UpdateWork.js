import './UpdateWork.scss';
import FormWork from '../../components/FormWork';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';

export default function UpdateWork() {
  const { id } = useParams();
  const { document } = useDocument('works', id);

  return (
    <div className='update-work'>
      <FormWork document={document} id={id} />
    </div>
  )
}