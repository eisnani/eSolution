import { useEffect, useRef, useState } from 'react';
import './Searchbar.scss';
import searchIcon from '../assets/search.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useThemeContext } from '../hooks/useThemeContext';

export default function Searchbar() {
  const [term, setTerm] = useState('');
  const { themeMode } = useThemeContext();
  const navigate = useNavigate();
  const inputRef = useRef();
  const pathname = useLocation().pathname;
  const queryString = useLocation().search;

  useEffect(() => {
    if (!queryString) inputRef.current.value = '';
  }, [queryString]);

  const handleKeyUp = (e) => {
    e.stopPropagation();
    navigate(`${pathname}?q=${term}`);
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    inputRef.current.value = '';
  }

  return (
    <div className={`searchbar ${themeMode}`}>
      <form onSubmit={handleOnSubmit} className='search-form'>
        <img 
          src={searchIcon} 
          alt="icon" 
        />
        <input 
          onKeyUp={handleKeyUp}
          type="input" 
          name='search'
          placeholder={pathname === '/users' ? 'Search by name' : 'Search by title'}
          onChange={e => setTerm(e.target.value)}
          ref={inputRef}
        />
      </form>
    </div>
  )
}