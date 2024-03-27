import { useEffect, useState } from 'react';
import axios from 'axios';
import Logout from './Logout';

const Nav = () => {
  const [loggedin, setLoggedin] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get('https://recipe-finder-backend-1.onrender.com/login', { withCredentials: true });
        if (response.status === 200) {
          setLoggedin(true);
        } 
      } catch (error) {
        setLoggedin(false);
      }
    }
  
  checkLogin();
  }, [])

  return (
    <div className='flex self-end justify-between w-full h-1/5 m-0 p-0'>
      <div className='flex items-center gap-4 w-[40%] pl-8 py-4 hover:-translate-y-2 transition-all duration-500'>
        <a className='' href='/'><img width='100' height='100' src={`https://recipe-finder-backend-1.onrender.com/media/recipe-finder.png`} alt='recipe finder logo' /></a>
        <a href='/'><h1 className='text-transparent bg-clip-text bg-gradient-to-br from-darkPink to-darkBlue text-3xl font-madimi'>Recipe Finder</h1></a>
      </div>
      <div className='w-2/3 flex justify-around'>
        <div className='w-[33%] flex items-center justify-center gap-6'>
          <a
            className='shadow-2xl shadow-white bg-gradient-to-br from-lightOrange to-darkPink text-white py-2 px-4 rounded-full hover:-translate-y-2 transition-all duration-500 ease-in-out'
            href='/'>Home
          </a>
        </div>
        <div className={loggedin ? 'w-[50%] flex items-center justify-around' : `w-[32%] flex items-center justify-between`}>
        {loggedin ? (
          <>
            <a
              className="shadow-2xl shadow-white bg-gradient-to-br from-lightBlue to-darkBlue text-white py-2 px-4 rounded-full hover:-translate-y-2 transition-all duration-500 ease-in-out"
              href="/make-recipe"
            >
              Add recipe
            </a>
            <a
              className="shadow-2xl shadow-white bg-gradient-to-br from-lightBlue to-darkBlue text-white py-2 px-4 rounded-full hover:-translate-y-2 transition-all duration-500 ease-in-out"
              href="/my-recipes"
            >
              My recipes
            </a>
            <a
              className="shadow-2xl shadow-white bg-gradient-to-br from-lightBlue to-darkBlue text-white py-2 px-4 rounded-full hover:-translate-y-2 transition-all duration-500 ease-in-out"
              href="/favorites"
            >
              My favorites
            </a>
            <Logout />
          </>
          ) : (
            <>
              <a
                className="shadow-2xl shadow-white bg-gradient-to-br from-lightBlue to-darkBlue text-white py-2 px-4 rounded-full hover:-translate-y-2 transition-all duration-500 ease-in-out"
                href="/make-recipe"
              >
                Add recipe
              </a>
              <a
                className="shadow-2xl shadow-white bg-gradient-to-br from-lightBlue to-darkBlue text-white py-2 px-4 rounded-full hover:-translate-y-2 transition-all duration-500 ease-in-out"
                href="/login"
              >
                Login
              </a>
              <a
                className="bg-gradient-to-br from-lightBlue to-darkBlue text-white py-2 px-4 rounded-full hover:-translate-y-2 transition-all duration-500 ease-in-out"
                href="/register"
              >
                Register
              </a>
            </>
        )}
        </div>
      </div>
    </div>
  )
}

export default Nav