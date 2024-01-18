import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/home";
import Student from "./pages/student/student";
import Faculty from "./pages/faculty/faculty";
import FillDetails from "./pages/fill-details";
import NoPageFound from "./pages/no-page-found";
import UnauthAccess from "./pages/unauth_access";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/student/*" element={<Student />}></Route>
        <Route exact path="/faculty/*" element={<Faculty />}></Route>
        <Route exact path="/fill_details" element={<FillDetails />}></Route>
        <Route exact path="/unauth_access" element={<UnauthAccess/>}></Route>
        <Route exact path="/*" element={<NoPageFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
