import { useState } from 'react';
import axios from 'axios';
import { AiFillCloseCircle } from "react-icons/ai";
import { FaPlusSquare, FaWindowClose } from "react-icons/fa";

const MakeRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [content, setContent] = useState('');
  const [ingredients, setIngredients] = useState([""]); // State for ingredients
  const [num, setNum] = useState(1); // State for counting the number of ingredient inputs
  console.log(ingredients)


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(); // Create a FormData object for file upload
    formData.append('title', title);
    formData.append('description', description);
    formData.append('cuisine', cuisine);
    formData.append('content', content);
    formData.append('file', file); 
    formData.append('ingredients', JSON.stringify(ingredients)); // Add ingredients to formData

    try {
      const response = await axios.post('http://localhost:5000/make-recipe', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data', // Add this header
        },
      });
      console.log(response.data.message);
      setSuccess(response.data.message);
      setShowSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error.response.data.error);
      if (error.response.data.error) {
        setError(error.response.data.error);
        setShowError(true);
      }
    }
  };

  const handleErrorDismiss = () => {
    setShowError(false);
  };

  const handleSuccess = () => {
    setShowSuccess(false);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]); // Add a new empty ingredient
    setNum(num + 1); // Increment the counter
  };

  const handleChangeIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value; // Update the ingredient at the specified index
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1); // Remove the ingredient at the specified index
    setIngredients(newIngredients);
    setNum(num - 1); // Decrement the counter
  };

  return (
    <form className='w-full h-screen flex-col flex items-center justify-center gap-4 ' method='POST' onSubmit={handleSubmit}>
      {showError ? (
        <div className='bg-red-500 text-white p-2 rounded absolute top-3 w-[30%] flex transition-all duration-200'>
          <p className='w-[90%]'>{error}!</p>
          <button onClick={handleErrorDismiss} className='bg-red-300 px-2 py-1 rounded text-white'><AiFillCloseCircle /></button>
        </div>
      ) : null}
      {showSuccess ? (
        <div className='bg-green-600 text-white p-2 rounded absolute top-3 w-[20%] flex transition-all duration-200'>
          <p className='w-[90%]'>{success}!</p>
          <button onClick={handleSuccess} className='bg-green-300 px-2 py-1 rounded text-white'><AiFillCloseCircle /></button>
        </div>
      ) : null}
      <h1 className='text-2xl'>Add new recipe:</h1>
      <input
        name='title'
        placeholder='Title'
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className='border-2 border-blue-300/80 text-black rounded p-2 w-1/4 bg-gray-200'
        maxLength={50}
      />
      <div className='flex w-full h-full text-black'>
        <div className='w-1/2 flex flex-col h-full items-center justify-center gap-6'>
          <input
            name='description'
            placeholder='Description'
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className='border-2 border-blue-300/80 rounded p-2 w-[80%] h-[10%] text-center bg-gray-200'
          />
          <textarea
            name='content'
            placeholder='Content'
            type='text'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className='border-2 border-blue-300/80 rounded p-2 w-[80%] h-[90%] text-center flex bg-gray-200'
          />
        </div>
        <div className='flex flex-col w-1/2 items-center justify-center gap-6 '>
          <input            name='file'
            type='file'
            onChange={(e) => setFile(e.target.files[0])}
            required
            className='border-2 border-blue-300/80 rounded p-2 w-[60%] h-[40%] bg-gray-200'
          />
          <input
            name='cuisine'
            placeholder='Cuisine'
            type='text'
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            required  
            className='border-2 border-blue-300/80 rounded p-2 w-[60%] text-center bg-gray-200'
          />
        </div>
      </div>
      <div className='w-[80%] self-center flex flex-col items-center h-[200px] z-10'>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="w-[80%] h-full flex items-center justify-center gap-2">
            <button onClick={handleAddIngredient}><FaPlusSquare className='text-2xl' /></button>
            <input
              placeholder='Ingredient'
              type='text'
              value={ingredient}
              onChange={(e) => handleChangeIngredient(index, e.target.value) }
              required
              className='border-2 border-blue-300/80 rounded p-2 w-[60%] text-center bg-gray-200'
            />
            <button onClick={() => handleRemoveIngredient(index)}><FaWindowClose className='text-red-600 text-2xl' /></button>
          </div>
        ))}
      </div>
      <button className='bg-blue-500 px-3 py-2 rounded text-white' type='submit'>
        Submit Recipe
      </button>
    </form>
  );
};

export default MakeRecipe;
