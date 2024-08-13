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

  return (
    <div className='login'>
      <img src={logo} alt="logo" />
      <form onSubmit={handleSubmit}>
        <h2 className='h2-heading mb-4r txt-ctr'>Welcome</h2>

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
        { !isPending && <button className='btn btn--primary mt-1r'>Login</button> }
        { isPending && <button className='btn btn--secondary mt-1r' disabled>Logging in...</button> }
        { error && <p className="form-error">{error}</p> }
      </form>

      <p>Edris' portfolio &copy; 2024</p>
    </div>
  )
}