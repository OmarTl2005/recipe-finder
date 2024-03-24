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
        <div className='flex flex-col items-center justify-center mt-10 w-[80%] self-center'>
            {recipe ?
              <>
                <h1 className='text-transparent bg-clip-text bg-gradient-to-br from-lightOrange to-darkBlue text-4xl font-madimi cursor-pointer hover:-translate-y-2 transition-all duration-500 '>{recipe.title}</h1>
                <div className='flex justify-between items-center w-full mt-12'>
                    <p className='text-center w-1/2 font-bitter'>{recipe.description}</p>
                    <div className='w-1/2'><img className=' rounded-3xl max-h-[430px] max-w-[430px]' src={`http://localhost:5000/uploads/${recipe.filename}`}></img></div>
                </div>
              </>
            :
              <h1 className='flex items-center justify-center'><AiOutlineLoading3Quarters className='animate-spin' />Loding</h1>}
        </div>
    );
};

export default Recipe;
