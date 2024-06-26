import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Filter from './Filter';
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdDeleteForever } from "react-icons/md";


const Favorites = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [close, setClose] = useState(true);
  const [select, setSelect] = useState(null);
  const [rating, setRating] = useState(null);
  const url = "http://localhost:5000"


  useEffect(() => {
    const getRecipes = async () => {
      try {
        const response = await axios(`${url}/recipes`, { withCredentials: true });
        setRecipes(response.data.map(recipe => ({ ...recipe })));
        console.log(response.data)
      } catch (error) {
        console.error(error.response?.data?.error || 'Error fetching recipes');
      }
    };

    getRecipes();
  }, []);

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await axios.delete(`${url}/recipes/${recipeId}`, { withCredentials: true });
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

    if (rating) {
      filtered = filtered.filter((recipe) =>
        String(recipe.rating) === rating
      );
    }

    return filtered;
  }, [search, recipes, select, rating]);

  const handleFavorite = async (recipeId) => {
    try {
      setRecipes(prevRecipes => {
        const updatedRecipes = prevRecipes.map(recipe => {
          if (recipe.id === recipeId) {
            return { ...recipe, favorite: !recipe.favorite };
          }
          return recipe;
        });
        return updatedRecipes;
      });
  
      const updatedRecipe = recipes.find(recipe => recipe.id === recipeId);
      const isFavorite = updatedRecipe.favorite;
  
      await axios.put(`${url}/favorite/${recipeId}`, {
        is_favorite: !isFavorite ? 'true' : 'false'
      }, { withCredentials: true });
  
      console.log('Favorite status updated successfully');
    } catch (error) {
      console.error('Error updating favorite status:', error.response?.data?.error || error.message);
    }
  }

  return (
    <div className='flex flex-col items-center justify-between h-full w-full self-center'>
      <div className='flex flex-col items-center gap-y-10 flex-wrap'>
        <h1 className='font-madimi text-3xl text-transparent bg-clip-text bg-gradient-to-br from-red-300 to-red-600 mt-7'>My favorites:</h1>
        {filteredRecipes.length > 0 ? (
            <ul className='flex text-center justify-center flex-wrap w-full h-full gap-[100px] max-h-[100px]'> 
              {filteredRecipes.map((recipe) => (
                recipe.favorite ? (
                  <a className='z-0' href={`/recipe/${recipe.id}`}>
                  <li className='w-[350px] h-[350px] hover:-translate-y-2 transition-all duration-500 flex flex-col items-center relative justify-center gap-1 isolate aspect-video shadow-white shadow-3xl p-8 rounded-[17%] bg-gradient-to-b from-blue-300/30' key={recipe.id}>
                    <button onClick={(e) => {e.preventDefault(); handleFavorite(recipe.id)}}>
                      {recipe.favorite ? <GoHeartFill className='text-red-600 text-[32px] absolute top-5 left-5 transition-all duration-200 ease-in-out' /> : <GoHeart className='transition-all duration-200 ease-in-out text-red-600 text-[32px] absolute top-5 left-5' />}
                    </button>
                    <img className='rounded-full w-[200px] h-[200px]' src={`${url}/uploads/${recipe.filename}`} alt={recipe.title} />
                    <h1 className='mt-5'>{recipe.title}</h1>
                    <button className='absolute top-4 right-4 text-4xl text-red-600 z-100' onClick={(e) => {e.preventDefault(); handleDeleteRecipe(recipe.id);}}><MdDeleteForever /></button>
                  </li>
                </a>
                ) : (null)
              ))}
            </ul>
            ) : (
              <p>No favorite recipe found :/</p>
            )}
      </div>
      

      <Filter setRating={setRating} select={select} setSelect={setSelect} search={search} setSearch={setSearch} close={close} setClose={setClose} cuisine={cuisine} />
    </div>
  );
};

export default Favorites;
