import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import './Navbar.scss';
import chevron from '../assets/chevron_left.svg';
import menu from '../assets/menu.svg';
import logoutIcon from '../assets/logout.svg';
import uesrIcon from '../assets/user.svg';
import brandIcon from '../assets/diversity_blue.svg';
import notificationsIcon from '../assets/notifications.svg';
import darkModeIcon from '../assets/dark_mode.svg';
import lightModeIcon from '../assets/light_mode.svg';

import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useThemeContext } from '../hooks/useThemeContext';
import { useCollection } from '../hooks/useCollection';
import Searchbar from './Searchbar';

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState('');
  const [toggle, setToggle] = useState(false);
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const {
    sidebarMode,
    showSidebar,
    hideSidebar,
    brandingMode,
    chevronMode,
    changeMode,
    themeMode,
  } = useThemeContext();
  const { documents, error } = useCollection('works');
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  const aNotifications = documents.filter(
    (doc) => doc.approval.approver === user.email
  ).length;
  const qNotifications = documents.filter(
    (doc) => doc.approval.queryTo === user.email
  ).length;

  document.onscroll = (e) => {
    e.stopPropagation();

    if (window.scrollY > 0) setScrolled('scrolled');
    else setScrolled('');
  };

  const handleClickBranding = (e) => {
    e.stopPropagation();
    navigate('/approvals');
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    setToggle((toggle) => !toggle);
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    logout();
  };

  const handleMode = (e) => {
    e.stopPropagation();
    setToggle((toggle) => !toggle);

    if (themeMode === 'light') {
      changeMode('dark');
      localStorage.setItem('themeMode', 'dark');
    } else if (themeMode === 'dark') {
      changeMode('light');
      localStorage.setItem('themeMode', 'light');
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();

    if (sidebarMode === 'hidden') {
      showSidebar();
      localStorage.setItem('sidebarMode', 'shown');
    } else if (sidebarMode === 'shown') {
      hideSidebar();
      localStorage.setItem('sidebarMode', 'hidden');
    }
  };

  const handleNavigateInquiries = (e) => {
    e.stopPropagation();
    navigate('/inquiries');
    setShowMenu(false);
  };

  const handleNavigateApprovals = (e) => {
    e.stopPropagation();
    navigate('/approvals');
    setShowMenu(false);
  };

  const handleMouseEnter = (e) => {
    e.stopPropagation();
    setShowMenu(true);
  };

  const handleMouseLeave = (e) => {
    e.stopPropagation();
    setShowMenu(false);
  };

  useEffect(() => {
    window.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!e.target.closest('#profile')) setToggle(false);
    });
    return () =>
      window.removeEventListener('click', (e) => {
        e.stopPropagation();
        if (!e.target.closest('#profile')) setToggle(false);
      });
  }, []);

  return (
    <>
      <div className={`navbar ${scrolled} ${themeMode}`}>
        <img
          onClick={handleClickBranding}
          className={`brand-icon ${brandingMode}`}
          src={brandIcon}
          alt='icon'
        />

        <button
          className='btn btn--chevron'
          type='button'
          onClick={handleClick}
        >
          <img src={chevron} alt='icon' className={`chevron ${chevronMode}`} />
          <img src={menu} alt='icon' className='menu' />
        </button>

        <div className='cont-link'>
          <span></span>

          <NavLink to='/approvals/details'>Request details</NavLink>
          <NavLink to='/requests/status'>Request status</NavLink>
          <NavLink to='/inquiries/details'>Inquiry details</NavLink>
          <NavLink to='/create-user'>Create a user</NavLink>
          <NavLink to='/update-user'>Update a user</NavLink>
          <NavLink to='/create-request'>Create a request</NavLink>
          <NavLink to='/update-request'>Update a request</NavLink>

          {(pathname === `/approvals` ||
            pathname === '/requests' ||
            pathname === '/inquiries' ||
            pathname === '/users') && <Searchbar />}
        </div>

        <div
          className='notification'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className='notification-bell'>
            <img src={notificationsIcon} alt='icon' />
            {!error && aNotifications + qNotifications !== 0 && (
              <span>{aNotifications + qNotifications}</span>
            )}
          </div>

          {showMenu && (
            <>
              {(aNotifications || qNotifications) !== 0 && (
                <div className='notification-menu'>
                  {aNotifications !== 0 && (
                    <p onClick={handleNavigateApprovals}>
                      ({aNotifications}) for approval.
                    </p>
                  )}
                  {qNotifications !== 0 && (
                    <p onClick={handleNavigateInquiries}>
                      ({qNotifications}) inquiry.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div onClick={handleToggle} className='profile' id='profile'>
          <p className='user'>
            <img src={uesrIcon} alt='icon' />
            <span>{user.displayName}</span>
          </p>

          <div className={`profile-menu ${toggle ? 'open' : ''}`}>
            <button
              className={`btn btn--logout ${themeMode}`}
              onClick={handleLogout}
            >
              <img src={logoutIcon} alt='icon' />
              <span>Logout</span>
            </button>
            <button
              className={`btn btn--mode ${themeMode}`}
              onClick={handleMode}
            >
              <img
                src={themeMode === 'light' ? darkModeIcon : lightModeIcon}
                alt='icon'
              />
              <span>{themeMode === 'light' ? 'Dark mode' : 'Light mode'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
