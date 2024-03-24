import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineLoading3Quarters, AiFillStar } from 'react-icons/ai';

const Recipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState();
  const [rating, setRating] = useState(null); // State for user's rating

  useEffect(() => {
    const getContent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipe/${id}`);
        setRecipe(response.data[0]);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    getContent();
  }, [id]);

  const handleRate = async (newRating) => {
    try {
      await axios.post(`http://localhost:5000/rating/${id}`, { rating: newRating });
      setRating(newRating); // Update displayed rating
      console.log('Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center mt-10 w-[80%] self-center'>
      {recipe ? (
        <>
          <h1 className='text-transparent bg-clip-text bg-gradient-to-br from-lightOrange to-darkBlue text-4xl font-madimi cursor-pointer hover:-translate-y-2 transition-all duration-500 '>
            {recipe.title}
          </h1>
          <div className='flex justify-between items-center w-full mt-12'>
            <div className='w-1/2 flex items-center justify-center'>
              <p className='text-center w-[80%] font-bitter'>{recipe.description}</p>
            </div>
            <div className='w-1/2 flex items-center justify-center'>
              <img className='rounded-3xl h-[400px] w-[400px]' src={`http://localhost:5000/uploads/${recipe.filename}`}></img>
            </div>
          </div>
          <div className='flex items-center justify-center mt-4'>
            {/* Render stars for rating */}
            {Array(5)
              .fill()
              .map((_, index) => (
                <AiFillStar
                  key={index}
                  className={`text-orange-400 mr-1 cursor-pointer ${
                    rating && rating >= index + 1 ? 'text-yellow-500' : ''
                  }`}
                  onClick={() => handleRate(index + 1)}
                />
              ))}
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
