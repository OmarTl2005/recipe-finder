import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoSend } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";


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
                const response = await axios.get(`http://localhost:5000/get-user`, { withCredentials: true });
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
            await axios.post(`http://localhost:5000/add-comment/${recipeId}`, { 'comment': newComment }, { withCredentials: true });
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    }

    const deleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:5000/delete-comment/${commentId}`, { withCredentials: true });
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }

  return (
    <div className='w-[80%] mt-[70px] flex flex-col items-center gap-y-10 min-h-[25rem] rounded-3xl font-madimi transition-all duration-500'>
        <h1 className='font-madimi text-3xl'>Comments:</h1>
        <div className='w-full self-start'>
        {
            comments && comments.length > 0 ? (
                <div className='flex flex-col w-full h-full gap-4'>{comments.map((comment) => {
                    return (
                        <div className='bg-gradient-to-br flex flex-col relative w-full h-full from-lightBlue/30 to-darkBlue/30 rounded-full'>
                          <p className='w-full ml-5 text-2xl'>{comment.username} says:</p>
                          <p className='w-[93%] self-end text-2xl'>{comment.comment}</p>
                          {
                                user && user.username === comment.username ? (
                                    <button className='text-3xl absolute top-4 right-5 text-red-500' onClick={() => deleteComment(comment.id)}><MdOutlineDeleteForever /></button>
                                ) : null
                          }
                        </div>
                    )
                })}</div>
            ) : 
            (
            <p className='text-2xl font-madimi'>No Comments</p>
            )
        }
        </div>
        <form className='flex w-full items-center h-full justify-center text-center gap-x-10'>
            <input className='text-black text-center rounded-xl w-[400px] h-[100px]' onChange={(e) => setNewComment(e.target.value)} required type='text' placeholder='Enter your comment' />
            <button onClick={handleComment}><IoSend className='text-2xl text-blue-400' /></button>
            
        </form>
    </div>
  )
}

export default Comments