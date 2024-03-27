import axios from 'axios'
import { AiFillCloseCircle } from "react-icons/ai";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [showError, setShowError] = useState(false)
    const [success, setSuccess] = useState(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/register', {
            'username': username,
            'email': email,
            'password': password,
            headers: { 'Content-Type': 'application/json' }
        }, { withCredentials: true })

        console.log(response.data.message)
        if (response.data.message) {
            setSuccess(response.data.message)
            setShowSuccess(true)
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        }
        } catch(error) {
            console.error('Error logging in:', error.response.data.error)
            if (error.response.data.error === 'User already exists') {
                setError(error.response.data.error)
                setShowError(true)
            }

        }
    }

    const handleErrorDismiss = () => {
        setShowError(false);
    };

    const handleSuccess = () => {
        setShowSuccess(false);
    }

  return (
    <>
      <form onSubmit={handleSubmit} className='w-full h-screen text-black flex-col flex items-center justify-center gap-4 transition-all duration-300'>
        {
            showError ? 
            <div className='bg-red-500 text-white p-2 rounded absolute top-3 w-[20%] flex transition-all duration-200'>
                <p className='w-[90%]'>{error}!</p>
                <button onClick={handleErrorDismiss} className='bg-red-300 px-2 py-1 rounded text-white'><AiFillCloseCircle /></button>
            </div>
            : null
        }
        {
            showSuccess ? 
            <div className='bg-green-600 text-white p-2 rounded absolute top-3 w-[20%] flex transition-all duration-200'>
                <p className='w-[90%]'>{success}!</p>
                <button onClick={handleSuccess} className='bg-green-300 px-2 py-1 rounded text-white'><AiFillCloseCircle /></button>
            </div>
            : null
        }
        <h1 className='text-2xl'>Register:</h1>
        <input
          id='username'
          placeholder='Username'
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className='border-2 border-blue-300/80 rounded p-2 w-1/4 bg-gray-200'
          />
        <input
          id='email'
          placeholder='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='border-2 border-blue-300/80 rounded p-2 w-1/4 bg-gray-200'
        />
        <input 
          id='password'
          placeholder='Password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='border-2 border-blue-300/80 rounded p-2 w-1/4 bg-gray-200'
        />
        <button className='bg-blue-500 px-3 py-2 rounded text-white' type='submit'>Register</button>
        <div className='flex flex-col items-center justify-center'>
          <p>Already have an account?</p>
          <a className='text-blue-500 underline' href='/login'>login</a>
        </div>
    </form>
    </>
  )
}

export default Register