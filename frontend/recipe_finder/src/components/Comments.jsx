import axios from 'axios';
import { useEffect, useState } from 'react';

const Comments = ({ recipeId }) => {
    const [comments, setComments] = useState(null);
    const [newComment, setNewComment] = useState('');


    useEffect(() => {
        const getComments = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/comments/${recipeId}`);
                setComments(response.data);
                console.log(comments);
            } catch(error) {
                console.error('Error fetching comments:', error);
            }
        }

        getComments();
    }, [recipeId]);

    const handleComment = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/add-comment/${recipeId}`, { 'comment': newComment }, { withCredentials: true });
            console.log(response.data);
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    }

  return (
    <div className='w-full mt-10 flex flex-col items-center'>
        {
            comments ? (
                <p>{comments.map((comment) => {
                    return (
                        <>
                          <p>{comment.username}</p>
                          <p>{comment.comment}</p>
                        </>
                    )
                })}</p>
            ) : 
            (
            <p>No Comments</p>
            )
        }
        <form>
            <input className='text-black' onChange={(e) => setNewComment(e.target.value)} type='text' placeholder='Enter your comment' />
            <button onClick={handleComment}>Comment</button>
        </form>
    </div>
  )
}

export default Comments