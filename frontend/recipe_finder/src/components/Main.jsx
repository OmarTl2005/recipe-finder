import { useState, useEffect } from 'react'
import axios from 'axios'

const Main = () => {
  const [recipes, setRecipes] = useState([]);


  useEffect(() => {
    const getRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/', { withCredentials: true });
        setRecipes(response.data);
        console.log(response.data)
      } catch (error) {
        console.error(error.response?.data?.error || 'Error fetching recipes');
      }
    };

    getRecipes();
  }, []);
  return (
    <div>
      {recipes.length > 0 ? (
          <ul className='flex text-center justify-center flex-wrap w-full gap-[100px]'> 
          {recipes.map((recipe) => (
            <li className='flex flex-col justify-center gap-1' key={recipe.id}>
              <img className='rounded-full' width='200px' height='200px' src={`http://localhost:5000/uploads/${recipe.filename}`} alt={recipe.title} />
              <h1 className='mt-5'>{recipe.title}</h1>
              <p>{recipe.description}</p>
            </li>
          ))}
        </ul>
        ) : (
          <p>Loading recipes...</p>
        )}
    </div>
  )
}

export default Main