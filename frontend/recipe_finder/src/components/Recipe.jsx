import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineLoading3Quarters } from "react-icons/ai";


const Recipe = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState();

    useEffect(() => {
        const getContent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/recipe/${id}`);
                setRecipe(response.data[0]);
            } catch(error) {
                console.error('Error fetching recipe:', error);
            }
        };

        getContent();
    }, [id]);

    // Render the title only if recipe is defined
    return (
        <div className='flex flex-col items-center justify-center'>
            {recipe ?
              <h1 className='text-2xl'>{recipe.title}</h1>
            :
              <h1 className='flex items-center justify-center'><AiOutlineLoading3Quarters className='animate-spin' />Loding</h1>}
        </div>
    );
};

export default Recipe;
