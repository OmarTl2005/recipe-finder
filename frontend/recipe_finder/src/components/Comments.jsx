import axios from 'axios';
import { useEffect, useState } from 'react';

const Comments = ({ recipeId }) => {
    const [comments, setComments] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [user, setUser] = useState(null);


    useEffect(() => {
        const getComments = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/comments/${recipeId}`);
                setComments(response.data);
            } catch(error) {
                console.error('Error fetching comments:', error);
            }
        }

        const getUser = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get-user', { withCredentials: true });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }

        getUser();
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

    const deleteComment = async (commentId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/delete-comment/${commentId}`, { withCredentials: true });
            console.log(response.data);
        } catch (error) {
            console.error('Error deleting comment:', error);
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
                          {
                                user && user.username === comment.username ? (
                                    <button onClick={() => deleteComment(comment.id)}>Delete</button>
                                ) : null
                          }
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