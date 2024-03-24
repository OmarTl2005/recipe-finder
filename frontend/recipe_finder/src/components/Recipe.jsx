import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Recipe = () => {
    const { id } = useParams();
    console.log(id);
    
  return (
    <div>Recipe</div>
  )
}

export default Recipe