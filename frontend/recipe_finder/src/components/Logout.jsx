import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { BiLoaderCircle } from "react-icons/bi";
import axios from 'axios';
import { AiFillCloseCircle } from "react-icons/ai";


const Logout = () => {
    const [success, setSuccess] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()


    const handleLogout = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
          const response = await axios.get('http://localhost:5000/logout', {withCredentials: true});
          console.log(response.data.message);
          setSuccess(response.data.message);
          setShowSuccess(true);
          setTimeout(() => {
              navigate('/login');
          }, 3000)
        } catch (error) {
          console.error(error.response.data.error);
          setIsLoading(false);
          setError(error.response.data.error);
          setShowError(true);
          setTimeout(() => {
            navigate('/login');
        }, 3000)
        }
      };
    
    useEffect(() => {
      if (success) {
        const timeout = setTimeout(() => {
          setSuccess(null);
        }, 3000);

        return () => clearTimeout(timeout);
      }
    }, [success]);

    const handleErrorDismiss = () => {
        setShowError(false);
      };

      const handleSuccess= () => {
        setShowSuccess(false);
      }

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <button className={!isLoading ? 'block px-3 py-2 bg-blue-500 text-white rounded' : 'hidden'} onClick={handleLogout}>Logout</button>
      {isLoading ? <BiLoaderCircle className='animate-spin' /> : <p>{success}</p>}
      {
          showError ? 
          <div className='bg-red-500 text-white p-2 rounded absolute top-3 w-[30%] flex transition-all duration-200'>
              <p className='w-[90%]'>{error}!</p>
              <button onClick={handleErrorDismiss} className='bg-red-300 px-2 py-1 rounded text-white'><AiFillCloseCircle /></button>
          </div>
          : null
      }
      {
        showSuccess ? 
        <div className='bg-green-600 text-white p-2 rounded absolute top-3 w-[20%] flex transition-all duration-200'>
            <p className='w-[90%]'>{success}!</p>
            <button onClick={handleSuccess} className='bg-green-300 px-2 py-1 rounded text-white'><AiFillCloseCircle className='w-full h-full' /></button>
        </div>
        : null
      }
    </div>
  )
}

export default Logout