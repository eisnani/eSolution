import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FormUser.scss';
import { designations, departments } from './SelectOptions';
import { useFirestore } from '../hooks/useFirestore';
import { useCreateUser } from '../hooks/useCreateUser';
import Alert from './Alert';

export default function FormUser({ id, user }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const { updateDocument, response } = useFirestore('users');
  const { createUser, isPending, error, res } = useCreateUser();

  const inputRef = useRef('');
  const formRef = useRef(null);
  const navigate = useNavigate();

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setDesignation('');
    setDepartment('');
    formRef.current.reset();
    setEmail('');
    setPassword('');
    inputRef.current.focus();
  }

  const handleReset = (e) => {
    e.preventDefault();
    resetForm();
  };

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setDesignation(user.designation);
      setDepartment(user.department);
    }
  }, [user])

  const submitHandler = async (e) => {
    e.preventDefault();
    if (id && user) {
      await updateDocument(id, { firstName, lastName, designation, department })
      if (!response.error) {
        setShowAlert(true);
        resetForm();
        setTimeout(() => navigate('/users'), 1000); 
      }
    }
    else 
      await createUser(email, password, firstName, lastName, designation, department);
  };

  useEffect(() => {
    if (res) {
      setShowAlert(true);
      resetForm();
    }
  }, [res])

  return (
    <div className="container-user-form">

      <h3 className="form-heading">Form</h3>

      <form onSubmit={submitHandler} className="user-form" ref={formRef}>

        <label>
          <span>First name</span>
          <input 
            id="input-first-name"
            type="text" 
            required
            onChange={e => setFirstName(e.target.value.toLowerCase())}
            value={firstName}
            ref={inputRef}
          />
        </label>

        <label>
          <span>Last name</span>
          <input 
            id="input-last-name"
            type="text" 
            required
            onChange={e => setLastName(e.target.value.toLowerCase())}
            value={lastName}
          />
        </label>

        <label>
          <span>Designation</span>
          <select 
            required 
            name='designation'
            onChange={e => setDesignation(e.target.value)}
            value={designation}
          >
            { designations.map(des => (
              <option key={des.value} value={des.value}>{des.label}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Department</span>
          <select 
            required
            name='department'
            onChange={e => setDepartment(e.target.value)}
            value={department}
          >
            { departments.map(dep => (
              <option key={dep.value} value={dep.value}>{dep.label}</option>
            ))}
          </select>
        </label>

        { !id && 
          <>
            <label>
              <span>Email</span>
              <input 
                required 
                type="email" 
                name='email'
                onChange={e => setEmail(e.target.value)}
                value={email}
              />
            </label>

            <label>
              <span>Password</span>
              <input 
                required 
                name='password'
                type="password" 
                onChange={e => setPassword(e.target.value)}
                value={password}
              />
            </label>
          </>
        }

        <div className="wrapper-btn">
          { isPending &&  
            <>
              <button className="btn btn--secondary" disabled>Submitting...</button>
            </>
          }
          { !(isPending || response.isPending) &&
            <>
              <button className="btn btn--primary">{id ? 'Update' : 'Submit'}</button>
              <button onClick={handleReset} type="reset" className="btn btn--secondary" >Clear</button>
              <Link to='/users' className="btn btn--info btn--link-cancel">Cancel</Link>
            </>
          }
        </div>
        { response.error && <p className="form-error">{response.error}</p> }
        { error && <p className="form-error">{error}</p> }
        { showAlert && <Alert message={id ? 'User is updated' : 'User added.'} setShowAlert={!id ? setShowAlert : null} /> }
      </form>
    </div>
  );
};