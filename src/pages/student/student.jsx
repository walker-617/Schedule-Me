import './student.css';
import Studentnavbar from './student-navbar';
import { Route, Routes } from 'react-router-dom';
import StudentFaculty from './student-faculty';
import StudentHome from './student-home';
import StudentFacultySlots from './student-faculty-slots';
import { useState } from 'react';

function Student() {

    const [teacher,setTeacher]=useState();

    return <>
        <Studentnavbar/>
        <Routes>
            <Route path='' element={<StudentHome/>}></Route>
            <Route path='home' element={<StudentHome/>}></Route>
            <Route path='faculty' element={<StudentFaculty setTeacher={setTeacher}/>}></Route>
            <Route path='faculty/faculty_slots' element={<StudentFacultySlots teacher={teacher}/>}></Route>
        </Routes>
    </>
}

export default Student;