import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiFillCloseCircle } from "react-icons/ai";


const Logout = ({ url }) => {
    const [success, setSuccess] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate()


    const handleLogout = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.get(`${url}/logout`, {withCredentials: true});
          console.log(response.data.message);
          setSuccess(response.data.message);
          setShowSuccess(true);
          setTimeout(() => {
              navigate('/login');
              window.location.reload();
          }, 1000)
        } catch (error) {
          console.error(error.response.data.error);
          setError(error.response.data.error);
          setShowError(true);
          setTimeout(() => {
            navigate('/login');
        }, 1000)
        }
      };
    
    useEffect(() => {
      if (success) {
        const timeout = setTimeout(() => {
          setSuccess(null);
        }, 1000);

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
    <div className='flex items-center justify-center'>
      <button onClick={handleLogout} className='shadow-2xl shadow-white bg-gradient-to-br from-lightBlue to-darkBlue text-white py-2 px-4 rounded-full hover:-translate-y-2 transition-all duration-500 ease-in-out'>Logout</button>
      {
          showError ? 
          <div className='bg-red-500 text-white p-2 rounded absolute top-3 left-[41%] w-[30%] flex transition-all duration-200'>
              <p className='w-[90%]'>{error}!</p>
              <button onClick={handleErrorDismiss} className='bg-red-300 px-2 py-1 rounded text-white'><AiFillCloseCircle className="w-full h-full" /></button>
          </div>
          : null
      }
      {
        showSuccess ? 
        <div className='bg-green-600 text-white p-2 rounded absolute top-3 left-[41%] w-[20%] flex transition-all duration-200'>
            <p className='w-[90%]'>{success}</p>
            <button onClick={handleSuccess} className='bg-green-300 px-2 py-1 rounded text-white'><AiFillCloseCircle className='w-full h-full' /></button>
        </div>
        : null
      }
    </div>
  )
}

export default Logout