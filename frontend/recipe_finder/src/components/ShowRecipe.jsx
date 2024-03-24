import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Filter from './Filter';
import { GoHeart, GoHeartFill } from "react-icons/go";


const ShowRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [close, setClose] = useState(false);
  const [select, setSelect] = useState(null);


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

  const cuisine = useMemo(() => {
    return [...new Set(recipes.map((recipe) => recipe.cuisine))];
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    let filtered = [...recipes];

    if (search) {
      filtered = filtered.filter((recipe) =>
        recipe.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (select) {
      filtered = filtered.filter((recipe) =>
        recipe.cuisine === select
      );
    }

    return filtered;
  }, [search, select, recipes]);

  const handleFavorite = (recipeId) => {
    setRecipes(prevRecipes => prevRecipes.map(recipe => {
      if (recipe.id === recipeId) {
        return { ...recipe, isFavorite: !recipe.isFavorite };
      }
      return recipe;
    }));
  }

  return (
    <div className='flex flex-col items-center justify-between h-full w-[80%] self-center'>
      {filteredRecipes.length > 0 ? (
        <ul className='flex text-center justify-center flex-wrap w-full h-full gap-[100px] max-h-[100px]'> 
          {filteredRecipes.map((recipe) => (
            <li className='flex flex-col relative justify-center gap-1 isolate aspect-video shadow-white shadow-3xl p-8 rounded-[17%] bg-gradient-to-b from-blue-300/30' key={recipe.id}>
              <button onClick={() => handleFavorite(recipe.id)}>
                {recipe.isFavorite ? <GoHeartFill className='text-red-600 text-[32px] absolute top-5 left-5 transition-all duration-200 ease-in-out' /> : <GoHeart className='transition-all duration-200 ease-in-out text-red-600 text-[32px] absolute top-5 left-5' />}
              </button>
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
      <Filter select={select} setSelect={setSelect} search={search} setSearch={setSearch} close={close} setClose={setClose} cuisine={cuisine} />
    </div>
  );
};

export default ShowRecipe;
