import { useEffect, useRef, useState } from 'react';
import { categories, services, goods, hr, sd } from '../components/SelectOptions';
import { Link, useNavigate } from 'react-router-dom';
import { useDocument } from '../hooks/useDocument';
import { useAuthContext } from '../hooks/useAuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { timestamp } from '../firebase/config';
import Loader from '../components/Loader';
import { assignApprover } from './AssignApprover';
import { useThemeContext } from '../hooks/useThemeContext';
import './FormWork.scss';

export default function FormWork({ document, id }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [typeOthers, setTypeOthers] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState('');
  const { user } = useAuthContext();
  const { document: _user } = useDocument('users', user.uid);
  const { addDocument, updateDocument, response } = useFirestore('works');
  const [classOthers, setClassOthers] = useState('');
  const { approvers } = assignApprover(type, 'juliet@test.com');
  const { themeMode } = useThemeContext();


  const titleRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (category === '') setType('');
    if (type === 'SERVICES_OTHERS' || type === 'GOODS_OTHERS' || type === 'HR_OTHERS' || type === 'SD_OTHERS') {
      setClassOthers('others')
    } 
    else setClassOthers('')
  }, [category, type])

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setType('');
    setTypeOthers('');
    setDescription('');
    setDueDate('');
    setAmount('');
    titleRef.current.focus();
  }

  const handleClear = (e) => {
    e.preventDefault();
    resetForm();
  }

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setCategory(document.category);
      setType(document.type);
      setTypeOthers(document.typeOthers);
      setDescription(document.description);
      setDueDate(document.dueDate.toDate().toISOString().split('T')[0].replace(/-/g, '-'));
      setAmount(document.amount);
    }
  }, [document])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const approver = 'juliet@test.com';

    const requestedBy = {
      firstName: _user.firstName,
      lastName: _user.lastName,
      department: _user.department,
      email: _user.email,
      id: _user.id,
    }

    if (id) {         
      const request = {
        requestedBy,
        title,
        category, 
        type, 
        typeOthers,
        description,
        createdAt: document.createdAt,
        dueDate: timestamp.fromDate(new Date(dueDate)),
        amount,
        approval: {
          approver,
          approvers,
          logs: [...document.approval.logs, {
            id: Math.random(),
            logDate: timestamp.fromDate(new Date()),
            approver: _user.email,
            action: 'updated'
          }]
        }
      }
      await updateDocument(id, request);
    } 
    else {
      const request = {
        requestedBy,
        title,
        category, 
        type, 
        typeOthers, 
        description, 
        createdAt: timestamp.fromDate(new Date()),
        dueDate: timestamp.fromDate(new Date(dueDate)), 
        amount,
        approval: { 
          approver, 
          approvers,
          logs: [{
            id: Math.random(),
            logDate: timestamp.fromDate(new Date()),
            approver: _user.email,
            action: 'created' 
          }]
        }
      };

      await addDocument(request);
    }

    if (response) navigate('/requests');
  }

  return (
    <> 
      { !_user && <Loader /> }
      { _user && 
        <section className="section-form-request">
          <div className={`form-container ${themeMode}`}>
            
            <h3 className="form-heading">Request form</h3>

            <form className='form-request' onSubmit={handleSubmit}>
              <div className="wrapper-requester">
                <span>Requester</span>
                <p className='requester'>{`${_user.firstName} ${_user.lastName}`}</p> 
              </div>

              <div className="wrapper-department">
                <span>Department</span>
                <p className='department'>{_user.department}</p>
              </div>

              <label className='title'>
                <span>Title *</span>
                <input 
                  type="text" 
                  name='title'
                  maxLength="80"
                  required
                  onChange={e => setTitle(e.target.value)}
                  value={title}
                  ref={titleRef}
                />
              </label>

              <label className='category'>
                <span>Category *</span>
                <select 
                  required 
                  name='category'
                  onChange={e => {
                    setCategory(e.target.value);
                    setType('');
                  }}
                  value={category}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </label>

              <label className={`type ${classOthers}`}>
                <span>Type *</span>
                <select 
                  required
                  name='type'
                  onChange={e => {
                    setType(e.target.value);
                    setTypeOthers('');
                  }}
                  value={type}
                  disabled={category === '' ? true : false}
                >
                  <option value="">Select a type</option>

                  { category === 'services' &&
                    services.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))
                  }
                  { category === 'goods' &&
                    goods.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))
                  }
                  { category === 'hr' &&
                    hr.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))
                  }
                  { category === 'sd' &&
                    sd.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))
                  }
                </select>
              </label>

              {
                (
                  type === 'SERVICES_OTHERS' || 
                  type === 'GOODS_OTHERS' || 
                  type === 'HR_OTHERS' || 
                  type === 'SD_OTHERS'
                )
                && 
                <label className='specify-type'>
                  <span>Specify *</span>
                  <input 
                    type="text" 
                    name='specType'
                    required
                    onChange={e => setTypeOthers(e.target.value)}
                    value={typeOthers}
                  /> 
                </label>
              }

              <label className='description'>
                <span>Description *</span>
                <textarea
                  type="text"
                  name='desc'
                  required
                  onChange={e => setDescription(e.target.value)}
                  value={description}
                ></textarea>
              </label>

              <label className='due-date'>
                <span>Due date *</span>
                <input
                  className='date-picker'
                  type="date" 
                  name='dueDate'
                  required
                  onChange={e => setDueDate(e.target.value)}
                  value={dueDate}
                /> 
              </label>

              <label className='amount'>
                <span>{`Amount (USD) *`}</span>
                <input 
                  type="number" 
                  name='amount'
                  min={0} 
                  required
                  onChange={e => setAmount(e.target.value)}
                  value={amount}
                /> 
              </label>

              <div className="wrapper-btn mt-2r">
                { response.isPending && <button className="btn btn--secondary" disabled>{id ? 'Updating...' : 'Submitting...'}</button> }
                { !response.isPending && 
                <>
                  <button type='submit' className="btn btn--primary">{id ? 'Update' : 'Submit'}</button>
                  { !id && 
                    <button type="reset" className="btn btn--secondary" onClick={handleClear}>Clear</button>
                  }
                  <Link to='/requests' className="btn btn--info btn--link-cancel">Cancel</Link>
                </>
                }
              </div> 
              { response.error && <p className="form-error">{response.error}</p> }
            </form>
          </div>
        </section>
      }
    </>
  )
}