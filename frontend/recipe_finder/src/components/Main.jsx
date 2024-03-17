import { useState } from 'react'
import axios from 'axios'

const Main = () => {
    const [recipe, setRecipe] = useState(null);

    const handleRecipe = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.get('http://localhost:5000/recipes');
          console.log(response.data.recipe);
          setRecipe(response.data.recipe);
        } catch (error) {
          console.error(error.response.data.error);
        }
      };
  return (
    <div onChange={handleRecipe}>{recipe}</div>
  )
}

export default Main