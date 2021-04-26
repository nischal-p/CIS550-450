import React, { useState } from 'react';
import '../../style/Form.css';
import SignupForm from './SignupForm';



const Signup = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function submitForm() {
    setIsSubmitted(true);
  }
  return (
    <>
      <div className='form-container'>
        <div className='form-content-left'>
         <img className="form-img" src="https://source.unsplash.com/cv4bk-aedJE" alt=""/>
        </div>
        {!isSubmitted ? (
          <SignupForm submitForm={submitForm} />
        ) : (
          <div />
        )}
      </div>
    </>
  );
};



export default Signup;
