import closeIcon from '../../assets/close.svg';
import { useDocument } from '../../hooks/useDocument';
import { useNavigate, useParams } from 'react-router-dom';
import { useThemeContext } from '../../hooks/useThemeContext';
import Approval from '../../components/Approval';
import Work from '../../components/Work';
import ApprovalCycle from '../../components/ApprovalCycle';

export default function WorkStatus({ user }) {
  const { id } = useParams();
  const { document } = useDocument('works', id);
  const navigate = useNavigate();
  const { modalMode, themeMode } = useThemeContext();
  
  return (
    <>
      { document && 
        <section className={`work-status ${modalMode} ${themeMode}`}>
          <div className='wrapper-icon'>
            <img 
              className='closeIcon' 
              onClick={() => navigate('/requests')} 
              src={closeIcon} alt="icon" 
            />
          </div>
          <div className="work-container">
            <Work document={document} />

            <h4 className='h4-heading mb-2r'>Approval Cycle</h4>
            <ApprovalCycle document={document} />

            <h4 className='h4-heading mb-2r'>Approval History</h4>
            <Approval document={document} user={user} />
          </div>
        </section>
      }
    </>
  )
}