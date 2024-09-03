import { useNavigate } from 'react-router-dom';

import './SectionContainer.scss';
import Loader from '../components/Loader';
import closeIcon from '../assets/close.svg'
import { useThemeContext } from '../hooks/useThemeContext';

export default function SectionContainer({ 
  children, isPending, error, query, resetPath, data, itemCount, heading, fallbackMsg 
}) {
  const navigate = useNavigate();
  const { themeMode } = useThemeContext();

  const handleReset = (e) => {
    e.stopPropagation();
    navigate(resetPath);
  }

  return (
    <section className={`section-container ${themeMode}`}>
      { isPending && <Loader /> }
      <div className='keyword-container'>
        { query && 
          <>
            <img onClick={handleReset} src={closeIcon} alt="icon"/>
            <p>Keyword: "<b>{query}</b>" {data.length === 0 && <span>has no match.</span>}</p>
          </>
        }
      </div> 
      { !error && !isPending && data.length > 0 &&
        <div className='table-container'>
          <h3 className='table-heading'>{heading}</h3>

          {children}

        </div>
      }
      { !error && !isPending && data.length === 0 && !itemCount && <p className='table-container'>{fallbackMsg}</p> }
      { error && <p className="error">{error}</p> }
    </section>
  )
}