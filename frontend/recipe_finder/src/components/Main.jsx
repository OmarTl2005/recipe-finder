import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Filter from './Filter';

const Main = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [close, setClose] = useState(false);
  const [select, setSelect] = useState(null);

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/', { withCredentials: true });
        setRecipes(response.data);
      } catch (error) {
        console.error(error.response?.data?.error || 'Error fetching recipes');
      }
    };

    getRecipes();
  }, []);

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

  return (
    <div className='flex flex-col items-center justify-between h-full w-[80%] self-center'>
      {filteredRecipes.length > 0 ? (
        <ul className='flex text-center justify-center flex-wrap w-full h-full gap-[100px] max-h-[100px]'> 
          {filteredRecipes.map((recipe) => (
            <li className='flex flex-col justify-center gap-1 isolate aspect-video shadow-white shadow-3xl p-8 rounded-[17%] bg-gradient-to-b from-blue-300/30' key={recipe.id}>
              <img className='rounded-full' width='200px' height='200px' src={`http://localhost:5000/uploads/${recipe.filename}`} alt={recipe.title} />
              <h1 className='mt-5'>{recipe.title}</h1>
              <p>{recipe.description}</p>
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

export default Main;
