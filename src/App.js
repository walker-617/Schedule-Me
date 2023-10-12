import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import Home from './pages/home';
import Student from "./pages/student/student";
import Faculty from "./pages/faculty/faculty";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>}></Route>
        <Route exact path="/student" element={<Student/>}></Route>
        <Route exact path="/faculty" element={<Faculty/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
