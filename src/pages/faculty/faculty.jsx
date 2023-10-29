import Facultynavbar from './faculty-navbar';
import { Route, Routes, useNavigate } from 'react-router-dom';
import FacultyHome from './faculty-home';
import  FacultySlots from './faculty-slots';
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import NoPageFound from '../no-page-found';

function Faculty() {

    const navigate=useNavigate();

    useEffect(()=>{
        getAuth().onAuthStateChanged((user)=>{
            if(!user?.email.endsWith("@nitc.ac.in"))
            {
                navigate("/unauth_access");
            }
        })
    },[]);

    return <>
        <Facultynavbar/>
        <Routes>
            <Route path='' element={<FacultyHome/>}></Route>
            <Route path='home' element={<FacultyHome/>}></Route>
            <Route path='slots' element={<FacultySlots/>}></Route>
            <Route path='*' element={<NoPageFound/>}></Route>
        </Routes>
    </>
}

export default Faculty;