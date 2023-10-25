import Facultynavbar from './faculty-navbar';
import { Route, Routes } from 'react-router-dom';
import FacultyHome from './faculty-home';
import  FacultySlots from './faculty-slots';

function Faculty() {

    return <>
        <Facultynavbar/>
        <Routes>
            <Route path='' element={<FacultyHome/>}></Route>
            <Route path='home' element={<FacultyHome/>}></Route>
            <Route path='slots' element={<FacultySlots/>}></Route>
        </Routes>
    </>
}

export default Faculty;