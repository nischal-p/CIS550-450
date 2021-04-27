import React from 'react';
import '../../style/Form.css';
import SignupForm from './SignupForm';



const Signup = () => {
  return (
    <>
      <div className='form-container'>
        <div className='form-content-left'>
         <img className="form-img" src="https://source.unsplash.com/cv4bk-aedJE" alt=""/>
        </div>
        <SignupForm />
      </div>
    </>
  );
};



export default Signup;
