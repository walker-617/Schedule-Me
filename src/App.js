import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import Home from './pages/home';
import Student from "./pages/student/student";
import Faculty from "./pages/faculty/faculty";
import FillDetails from "./pages/fill-details";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>}></Route>
        <Route exact path="/student/*" element={<Student/>}></Route>
        <Route exact path="/faculty/*" element={<Faculty/>}></Route>
        <Route exact path="/fill_details" element={<FillDetails/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
