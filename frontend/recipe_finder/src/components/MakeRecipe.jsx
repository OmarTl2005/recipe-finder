import { useState } from 'react';
import axios from 'axios';

const MakeRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(); // Create a FormData object for file upload
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file); // Add the selected file

    try {
      const response = await axios.post('http://localhost:5000/make-recipe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type for file upload
          // Include Authorization header if a token is used
        },
      }, {withCredentials: true});
      console.log(response.data.message); // Assuming the response contains a message on success
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  return (
        <form className='w-screen h-screen flex-col flex items-center justify-center gap-4' method='POST' onSubmit={handleSubmit}>
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