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
    <div className="App flex flex-col bg-bgBlue w-screen h-screen text-white">
      <BrowserRouter>
      <Nav />
        <Routes>
          <Route path="/" element={<Main />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/make-recipe" element={<MakeRecipe />} />
          <Route path="/show-recipe" element={<ShowRecipe />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
