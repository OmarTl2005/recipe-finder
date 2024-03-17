import { useState } from 'react';
import axios from 'axios';
import { AiFillCloseCircle } from "react-icons/ai";


const MakeRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null)
  const [showError, setShowError] = useState(false)
  const [success, setSuccess] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(); // Create a FormData object for file upload
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file); // Add the selected file

    try {
      const response = await axios.post('http://localhost:5000/make-recipe', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data', // Add this header
      },
    });
      console.log(response.data.message);
      setSuccess(response.data.message)
      setShowSuccess(true)
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    } catch (error) {
      console.error(error.response.data.error);
      if (error.response.data.error) {
        setError(error.response.data.error)
        setShowError(true)
      }
    }
  };

  const handleErrorDismiss = () => {
    setShowError(false);
  };

  const handleSuccess = () => {
    setShowSuccess(false);
  };

  return (
        <form className='w-screen h-screen flex-col flex items-center justify-center gap-4' method='POST' onSubmit={handleSubmit}>
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
              <button onClick={handleSuccess} className='bg-green-300 px-2 py-1 rounded text-white'><AiFillCloseCircle /></button>
          </div>
          : null
        }
          <h1 className='text-2xl'>Add new recipe:</h1>
          <input
            name='title'
            placeholder='Title'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className='border-2 border-blue-300/80 rounded p-2 w-1/4 bg-gray-200'
          />
          <input
            name='description'
            placeholder='description'
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className='border-2 border-blue-300/80 rounded p-2 w-1/4 bg-gray-200'
          />
          <input
            name='file'
            type='file'
            onChange={(e) => setFile(e.target.files[0])} // Access the actual file object from the event
            required
            className='border-2 border-blue-300/80 rounded p-2 w-1/4 bg-gray-200'
          />
          <button className='bg-blue-500 px-3 py-2 rounded text-white' type='submit'>
            Submit Recipe
          </button>
        </form>
    )
      }
export default MakeRecipe;