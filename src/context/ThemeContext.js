import { createContext, useEffect, useReducer } from "react";

export const ThemeContext = createContext();

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'HIDE_SIDEBAR':
      return { ...state, sidebarMode: 'hidden', modalMode: 'expanded', chevronMode: 'rotate', brandingMode: 'show' }
    case 'SHOW_SIDEBAR':
      return { ...state, sidebarMode: 'shown', modalMode: null, chevronMode: null, brandingMode: null }
    case 'MAX_MODAL':
      return { ...state, modalMode: action.payload }
    default:
      return state;
  }
}

export const ThemeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, {
    sidebarMode: 'shown',
    chevronMode: null,
    brandingMode: null,
    modalMode: null,
  });

  const hideSidebar = () => dispatch({ type: 'HIDE_SIDEBAR' });
  const showSidebar = () => dispatch({ type: 'SHOW_SIDEBAR' });

  useEffect(() => {
    let sidebarMode = localStorage.getItem('sidebarMode');
    if (sidebarMode === 'hidden') hideSidebar();
    else if (sidebarMode === 'shown') showSidebar();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window.innerWidth < 974) {
        hideSidebar();
        localStorage.setItem('sidebarMode', 'hidden');
      } else if (window.innerWidth > 974) {
        showSidebar();
        localStorage.setItem('sidebarMode', 'shown');
      }
    })

    return () => window.removeEventListener('resize', () => {
      if (window.innerWidth < 974) {
        hideSidebar();
        localStorage.setItem('sidebarMode', 'hidden');
      } else if (window.innerWidth > 974) {
        showSidebar();
        localStorage.setItem('sidebarMode', 'shown');
      }
    })
  }, [])
  
  return (
    <ThemeContext.Provider value={{ ...state, hideSidebar, showSidebar }}>
      { children }
    </ThemeContext.Provider>
  )
};