import { useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.scss';
import addPerson from '../assets/person_add.svg';
import closeIcon from '../assets/close.svg';
import personGroup from '../assets/person_group.svg';
import listIcon from '../assets/list.svg';
import queryIcon from '../assets/query.svg';
import approvalIcon from '../assets/approval.svg';
import addWork from '../assets/playlist_add.svg';
import barnding from '../assets/diversity.svg';
import { useAuthContext } from '../hooks/useAuthContext';
import { useThemeContext } from '../hooks/useThemeContext';

export default function Sidebar() {
  const divRef = useRef(null);
  const { isAdmin } = useAuthContext();
  const { sidebarMode, hideSidebar } = useThemeContext();
  const navigate = useNavigate();

  const handleClickBranding = (e) => {
    e.stopPropagation();
    navigate('/approvals');
  }
  
  const handleClose = (e) => {
    e.stopPropagation();

    if (sidebarMode === 'shown') {
      hideSidebar();
      localStorage.setItem('sidebarMode', 'hidden');
    }
  }

  return (
    <>
      <div className={`sidebar ${sidebarMode}`}>
        <div onClick={handleClickBranding} className='logo-placeholder' ref={divRef}>
          <h1 className='branding'>
            <img src={barnding} alt='icon' />
            eSolution
          </h1>
        </div>

        <img onClick={handleClose} className='iconClose' src={closeIcon} alt="icon" />

        <nav onClick={window.innerWidth > 974 ? null : handleClose} >
          <NavLink to='/approvals'>
            <img src={approvalIcon} alt='icon' />
            For Approvals
          </NavLink>

          <NavLink to='/inquiries'>
            <img src={queryIcon} alt='icon' />
            Inquiries
          </NavLink>

          <NavLink to='/requests'>
            <img src={listIcon} alt='icon' />
            My Requests
          </NavLink>

          <NavLink to='/create-request'>
            <img src={addWork} alt='icon' />
            Create a Request
          </NavLink>

          <NavLink to='/users'>
            <img src={personGroup} alt='icon' />
            Users
          </NavLink>

          {isAdmin && (
            <NavLink to='/create-user'>
              <img src={addPerson} alt='icon' />
              Create User
            </NavLink>
          )}
        </nav>

        <footer>
          <p>Edris' portfolio &copy; 2024</p>
        </footer>
      </div>
      { sidebarMode === 'shown' && <div onClick={handleClose} className="sidebar-backdrop"></div> }
    </>
  );
}
