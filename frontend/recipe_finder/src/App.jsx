import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Register from "./components/Register";
import Logout from "./components/Logout";
import Nav from "./components/Nav";
import Main from "./components/Main";
import MakeRecipe from "./components/MakeRecipe";

function App() {
  return (
    <div className="App flex flex-col">
      <BrowserRouter>
      <Nav />
        <Routes>
          <Route path="/" element={<Main />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/make-recipe" element={<MakeRecipe />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
