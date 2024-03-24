import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './Filter';

const Main = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [close, setClose] = useState(false);


  useEffect(() => {
    const getRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/', { withCredentials: true });
        if (search) {
          const filtered = response.data.filter((recipe) => recipe.title.toLowerCase().includes(search.toLowerCase()));
          setRecipes(filtered);
        } else {
          setRecipes(response.data);
        }
        console.log(response.data)
      } catch (error) {
        console.error(error.response?.data?.error || 'Error fetching recipes');
      }
    };

    getRecipes();
  }, [search]);
  return (
    <div className='flex flex-col items-center justify-between h-screen w-[80%] self-center pb-20 m-0 px-0'>
      {recipes.length > 0 ? (
          <ul className='flex text-center justify-center flex-wrap w-full h-full gap-[100px] max-h-[100px]'> 
          {recipes.map((recipe) => (
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
      <Filter search={search} setSearch={setSearch} close={close} setClose={setClose} cuizine={recipes.cuizine} />
    </div>
  )
}

export default Main