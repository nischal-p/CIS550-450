import React from 'react';
import { useState } from 'react';

import { useHistory } from 'react-router-dom'

import '../../style/Form.css';

const validate = values => {
    let errors = {};
  
    if (!values.email) {
      errors.email = 'Email not given';
    } else if (!values.email.match(/\S+@\S+\.\S+/)) {
      errors.email = 'Email address is invalid';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 4) {
      errors.password = 'Password needs to be 4 characters or more';
    }
  
    if (!values.password2) {
      errors.password2 = 'Write your password again to proceed';
    } else if (values.password2 !== values.password) {
      errors.password2 = 'Passwords do not match';
    }
    return errors;
  }

const SignupForm = () => {
  const history = useHistory()

  const [values, setValues] = useState({
    email: '',
    password: '',
    password2: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    setErrors(validate(values));

    // fetch (post to database the signup values) 
    fetch('http://localhost:8081/create_user', {
      method : 'post',
      headers: {'Content-Type':'application/json'},
      body : JSON.stringify(values)
    }).then((response) => response.json())
      .then(responseJson => {
        if (responseJson) {
          history.push('/')
        } else {
          // TODO: add some error object saying that the password is incorrect
          history.push('/signup')
        }
      })
  };

  return (
    <div className='content-right'>
      <form onSubmit={handleSubmit} className='form' noValidate>
        <p>
         Create Account by filling out following information!
        </p>
        <div className='inputs'>
          <label className='form-label'>Email</label>
          <input
            className='form-input'
            type='email'
            name='email'
            placeholder='Enter your email'
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div className='inputs'>
          <label className='form-label'>Password</label>
          <input
            className='form-input'
            type='password'
            name='password'
            placeholder='Enter your password'
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <div className='inputs'>
          <label className='form-label'>Confirm Password</label>
          <input
            className='form-input'
            type='password'
            name='password2'
            placeholder='Confirm your password'
            value={values.password2}
            onChange={handleChange}
          />
          {errors.password2 && <p>{errors.password2}</p>}
        </div>
        <button className='input-btn' type='submit'>
          Sign up
        </button>
        <span className='input-login'>
          Already have an account? Login <a href='/'>here</a>
        </span>
      </form>
    </div>
  );
};

export default SignupForm;
