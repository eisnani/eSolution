import FormWork from '../../components/FormWork';
import { useThemeContext } from '../../hooks/useThemeContext';
import './CreateWork.scss';


export default function CreateWork() {
  const { themeMode } = useThemeContext();

  return (
    <div className={`create-work ${themeMode}`}> 
      <FormWork />
    </div>
  );
};
