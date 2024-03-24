import { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './Filter';


const ShowRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');


  useEffect(() => {
    const getRecipes = async () => {
      try {
        const response = await axios('http://localhost:5000/recipes', { withCredentials: true });
        setRecipes(response.data);
        console.log(response.data)
      } catch (error) {
        console.error(error.response?.data?.error || 'Error fetching recipes');
      }
    };

    getRecipes();
  }, []);

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/recipes/${recipeId}`, { withCredentials: true });
      if (response.status === 200) {
        console.log('Recipe deleted successfully!');
        window.location.reload();
      } else {
        console.error('Error deleting recipe:', response.data.error);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  return (
    <div>

<div className='flex flex-col items-center justify-between h-full w-full self-center'>
      {recipes.length > 0 ? (
          <ul className='flex text-center justify-center flex-wrap w-full h-full gap-[100px]'> 
          {recipes.map((recipe) => (
            <li className='flex flex-col justify-center gap-1 isolate aspect-video shadow-white shadow-3xl p-8 rounded-[17%] bg-gradient-to-b from-blue-300/30' key={recipe.id}>
              <img className='rounded-full' width='200px' height='200px' src={`http://localhost:5000/uploads/${recipe.filename}`} alt={recipe.title} />
              <h1 className='mt-5'>{recipe.title}</h1>
              <p>{recipe.description}</p>
              <button className='bg-gradient-to-tr from-lightBlue to-darkBlue rounded-full self-center py-2 px-3' onClick={() => handleDeleteRecipe(recipe.id)}>Delete recipe</button>
            </li>
          ))}
        </ul>
        ) : (
          <p>Loading recipes...</p>
        )}
      <Filter search={search} setSearch={setSearch} />
    </div>
    </div>
  );
};

export default ShowRecipe;
