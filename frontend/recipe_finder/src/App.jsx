import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Register from "./components/Register";
import Logout from "./components/Logout";
import Nav from "./components/Nav";
import Main from "./components/Main";
import MakeRecipe from "./components/MakeRecipe";
import ShowRecipe from "./components/ShowRecipe";

function App() {
  return (
    <div className="flex flex-col bg-bgBlue w-screen h-screen text-white m-0 p-0 overflow-y-scroll ">
      <BrowserRouter>
      <Nav className="w-full h-full p-0 m-0" />
        <Routes>
          <Route path="/" element={<Main />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/make-recipe" element={<MakeRecipe />} />
          <Route path="/my-recipes" element={<ShowRecipe />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
