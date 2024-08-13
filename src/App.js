import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';
import Login from './pages/login/Login';
import CreateWork from './pages/create-work/CreateWork';
import CreateUser from './pages/create-user/CreateUser';
import Navbar from './components/Navbar';
import UsersList from './pages/users-list/UsersList';
import Sidebar from './components/Sidebar';
import UpdateUser from './pages/update-user/UpdateUser';
import UpdateWork from './pages/update-work/UpdateWork';
import { useAuthContext } from './hooks/useAuthContext';
import { useThemeContext } from './hooks/useThemeContext';
import WorkList from './pages/work-list/WorkList';
import WorkForApproval from './pages/work-for-approval/WorkForApproval';
import WorkWithQuery from './pages/work-with-query/WorkWithQuery';

function App() {
  const { user, authIsReady, isAdmin } = useAuthContext();
  const { sidebarMode } = useThemeContext();

  return (
    <div className="App">
      { authIsReady && 
        <BrowserRouter>
          { user && <Sidebar /> }        

          <div className="app-container">
            { user && <Navbar /> }

              <Routes>
                <Route path='/approvals/*' element={ user ? <WorkForApproval /> : <Navigate to='/login' />} />
                <Route path='/login' element={ !user ? <Login /> : <Navigate to='/approvals' />}/>
                <Route path='*' element={ <Navigate to='/approvals' />} />
                <Route path='/requests/*' element={ user ? <WorkList /> : <Navigate to='/login' />} />
                <Route path='/inquiries/*' element={ user ? <WorkWithQuery /> : <Navigate to='/login' />} />
                <Route path='/create-user' element={ (user && isAdmin) ? <CreateUser /> : <Navigate to='/login' /> }/>
                <Route path='/update-user/:id' element={  user ? <UpdateUser /> : <Navigate to='/login' /> }/>
                <Route path='/users' element={ user ? <UsersList /> : <Navigate to='/login' /> }/>
                <Route path='/create-request' element={  user ? <CreateWork /> : <Navigate to='/login' /> }/>
                <Route path='/update-request/:id' element={  user ? <UpdateWork /> : <Navigate to='/login' /> }/>
              </Routes>
        
              <footer>
                <p className={sidebarMode}>Edris' portfolio &copy; 2024</p>
              </footer> 
             
          </div>
        </BrowserRouter>
      }
    </div>
  );
}

export default App;