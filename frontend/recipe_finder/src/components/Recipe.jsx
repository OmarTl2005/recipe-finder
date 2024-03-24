import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';


const Recipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState();
  const [rating, setRating] = useState(null); // State for user's rating

  useEffect(() => {
    const getContent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipe/${id}`);
        setRecipe(response.data[0]);
        setRating(response.data[0]?.rating || null); // Initialize rating with the value from the backend
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    getContent();
  }, [id]);

  const handleRate = async (newRating) => {
    try {
      await axios.post(`http://localhost:5000/rating/${id}`, { 'rating': newRating }, { withCredentials: true });
      console.log('Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center mt-10 w-[80%] self-center mb-20'>
      {recipe ? (
        <>
          <h1 className='text-transparent bg-clip-text bg-gradient-to-br from-lightOrange to-darkBlue text-4xl font-madimi cursor-pointer hover:-translate-y-2 transition-all duration-500 '>
            {recipe.title}
          </h1>
          <div className='flex justify-between items-center w-full mt-12 h-screen'>
            <div className='flex flex-col w-1/2 gap-6'>
                <div className='w-full flex flex-col items-center justify-center gap-y-10'>
                  <h1 className='text-3xl font-madimi'>Description:</h1>
                  <p className='text-center font-bitter w-[80%] '>{recipe.description}</p>
                </div>
                <div className='w-full flex flex-col items-center justify-center gap-y-10'>
                  <h1 className='text-3xl font-madimi'>Instructions:</h1>
                  <p className='text-center font-bitter w-[80%]'>{recipe.content}</p>
                </div>
            </div>
            <div className='w-1/2 flex flex-col items-center gap-5 justify-center'>
              <img alt='recipe' className='rounded-3xl h-[400px] w-[400px]' src={`http://localhost:5000/uploads/${recipe.filename}`}></img>
              <h1 className='text-xl font-madimi'>Cuisine: {recipe.cuisine}</h1>
              <div className='flex'>
                {
                    [...Array(5)].map((star, index) => {
                        const currentRating = index + 1;
                        return (
                            <label key={index} onClick={() => handleRate(currentRating)}>
                                <input className='hidden' type='radio' name='rating' value={currentRating} checked={currentRating === rating} onChange={() => setRating(currentRating)} />
                                <FaStar className='cursor-pointer' size={50} color={currentRating <= rating ? '#ffc107' : '#e4e5e9'} />
                            </label>
                        )
                    })
                }
              </div>
            </div>
            <div></div>
          </div>
        </>
      ) : (
        <h1 className='flex items-center justify-center'>
          <AiOutlineLoading3Quarters className='animate-spin' /> Loading
        </h1>
      )}
    </div>
  );
};

export default Recipe;
