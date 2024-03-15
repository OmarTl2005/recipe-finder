import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Register from "./components/Register";
import Logout from "./components/Logout";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
