import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Register from "./components/Register";
import Logout from "./components/Logout";
import Nav from "./components/Nav";
import Main from "./components/Main";
import MakeRecipe from "./components/MakeRecipe";
import ShowRecipe from "./components/ShowRecipe";
import Recipe from "./components/Recipe";
import Favorites from "./components/Favorites";

function App() {
  const url = 'https://recipe-finder-backend-1.onrender.com'
  return (
    <div className="flex flex-col bg-bgBlue w-screen h-screen text-white m-0 p-0 overflow-y-scroll ">
      <BrowserRouter>
      <Nav className="w-full h-full p-0 m-0" />
        <Routes>
          <Route path="/" element={<Main url={url} />}/>
          <Route path="/login" element={<Login url={url} />} />
          <Route path="/register" element={<Register url={url} />} />
          <Route path="/logout" element={<Logout url={url} />} />
          <Route path="/make-recipe" element={<MakeRecipe url={url} />} />
          <Route path="/my-recipes" element={<ShowRecipe url={url} />} />
          <Route path="/recipe/:id" element={<Recipe url={url} />} />
          <Route path="/favorites" element={<Favorites url={url} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
