import './student.css';
import Studentnavbar from './student-navbar';
import { Route, Routes, useNavigate } from 'react-router-dom';
import StudentFaculty from './student-faculty';
import StudentHome from './student-home';
import StudentFacultySlots from './student-faculty-slots';
import { useEffect, useState } from 'react';
import NoPageFound from '../no-page-found';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function Student() {

    const [teacher,setTeacher]=useState();
    const navigate=useNavigate();

    useEffect(()=>{
        getAuth().onAuthStateChanged((user)=>{
            if(user && user.email.endsWith("@nitc.ac.in"))
            {
                navigate("/unauth_access");
            }
        })
    },[]);

    return <>
        <Studentnavbar/>
        <Routes>
            <Route path='' element={<StudentHome/>}></Route>
            <Route path='home' element={<StudentHome/>}></Route>
            <Route path='faculty' element={<StudentFaculty setTeacher={setTeacher}/>}></Route>
            <Route path='faculty/faculty_slots' element={<StudentFacultySlots teacher={teacher}/>}></Route>
            <Route path='*' element={<NoPageFound/>}></Route>
        </Routes>
    </>
}

export default Student;