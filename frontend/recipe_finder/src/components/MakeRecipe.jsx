import React, { useState } from 'react';
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
  const [content, setContent] = useState([""]);
  const [ingredients, setIngredients] = useState([""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(); // Create a FormData object for file upload
      formData.append('title', title);
      formData.append('description', description);
      formData.append('cuisine', cuisine);
      formData.append('file', file);
      content.forEach((instruction) => {
        formData.append('instruction', instruction);
      });
      
      ingredients.forEach((ingredient) => {
        formData.append('ingredient', ingredient);
      });
  
      // Send recipe data to make-recipe route
      const response = await axios.post('http://localhost:5000/make-recipe', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data', // Add this header
        },
      });
  
      // Check if response is defined before accessing data property
      if (response && response.data) {
        // Show success message
        setSuccess('Recipe submitted successfully');
        setShowSuccess(true);
      } else {
        // Handle undefined response
        setError('Error submitting recipe');
        setShowError(true);
      }
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
  };

  const handleAddContent = () => {
    setContent([...content, ""]); // Add a new empty ingredient
  };

  const handleChangeIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value; // Update the ingredient at the specified index
    setIngredients(newIngredients);
  };

  const handleChangeContent = (index, value) => {
    const newContent = [...content];
    newContent[index] = value; // Update the ingredient at the specified index
    setContent(newContent);
  };

  const handleRemoveIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1); // Remove the ingredient at the specified index
      setIngredients(newIngredients);
    }
  };

  const handleRemoveContent = (index) => {
    if (content.length > 1) {
      const newContent = [...content];
      newContent.splice(index, 1); // Remove the ingredient at the specified index
      setContent(newContent);
    }
  };


  return (
    <form className='w-full h-auto flex-col flex items-center justify-center gap-4 mb-[40px]text-black mb-8' method='POST' onSubmit={handleSubmit}>
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
            className='border-2 border-blue-300/80 rounded p-2 w-[80%] h-[70px] text-center bg-gray-200'
          />
        </div>
        <div className='flex flex-col w-1/2 items-center justify-center gap-6 '>
          <input
            name='file'
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
      <div className='w-[80%] h-auto self-center flex flex-col items-center z-10 text-black gap-2'>
        <h1 className='text-2xl font-madimi text-white'>Instructions:</h1>
        <div className='w-full h-auto self-center flex flex-col items-center z-10 text-black gap-2'>
              {content.map((content, index) => (
                <div key={index} className="w-[80%] h-full flex items-center justify-center gap-2">
                  <button onClick={handleAddContent}><FaPlusSquare className='text-2xl text-white' /></button>
                  <input
                    placeholder='Instruction'
                    type='text'
                    value={content}
                    onChange={(e) => handleChangeContent(index, e.target.value)}
                    required
                    className='border-2 border-blue-300/80 rounded p-2 w-[60%] text-center bg-gray-200'
                  />
                  <button onClick={() => handleRemoveContent(index)}><FaWindowClose className='text-red-600 text-2xl' /></button>
                </div>
              ))}
           </div>
        <h1 className='text-2xl font-madimi text-white'>Ingredients:</h1>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="w-[80%] h-full flex items-center justify-center gap-2">
            <button onClick={handleAddIngredient}><FaPlusSquare className='text-2xl text-white' /></button>
            <input
              placeholder='Ingredient'
              type='text'
              value={ingredient}
              onChange={(e) => handleChangeIngredient(index, e.target.value)}
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