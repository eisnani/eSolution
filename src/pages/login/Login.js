import './Login.scss';
import logo from '../../assets/diversity.svg';
import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();

    login(email, password);
  }

  function handleClick(e) {
    e.stopPropagation();
    login('juliet@test.com', '123456');
  }

  return (
    <section className='login'>
      <img src={logo} alt="logo" />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2 className='login-heading'>Welcome</h2>

          <label>
            <span>Email</span>
            <input 
              type="email" 
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>

          <label>
            <span>Password</span>
            <input 
              type="password"
              required 
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label>
          { !isPending && 
            <>
              <button className='btn btn--primary btn--login'>Login (CRUD)</button> 
              <p className='or'>- Or -</p>
            </>
          }
          { isPending && <button className='btn btn--secondary btn--logging-in' disabled>Logging in...</button> }
          { error && <p className="form-error">{error}</p> }
        </form>
        { !isPending && 
          <button onClick={handleClick} className='btn btn--tertiary btn--demo'>
            <span>Continue as guest</span>
            <span>(Read only)</span>
          </button>
        }
      </div>
      <p className='copyright'>Edris' portfolio &copy; 2024</p>
    </section>
  )
}