import { useEffect, useRef, useState } from "react";
import { getAuth } from "firebase/auth";
import user_image from "../user.png";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function FillDetails() {

    const [error,setError]=useState("");
    const departmentRef=useRef("");
    const coursesRef=useRef("");
    const [user,setUser]=useState();
    const navigate=useNavigate();

    useEffect(()=>{
        getAuth().onAuthStateChanged((user)=>{
            setUser(user);
        })
    },[]);

    function handleSaveLogin(){
        const department=departmentRef.current.value;
        const courses=coursesRef.current.value;
        if(!department || !courses)
        {
            setError("Please fill the details.");
            return;
        }
        else{
            setError("");
        }
        const user=getAuth().currentUser;
        const email=user.email;
        const name=user.displayName;
        const imageURL=user.photoURL.replace(/=s\d+-c$/, "=s200-c");
        setDoc(doc(db,"faculty",email),{
            name: name,
            imageURL: imageURL,
            department: department,
            courses: courses
        }).then(()=>{
            navigate("/faculty");
        })
    }

    return <>
        <div className="fill-details-navbar">
            <div className='student-navbar-title' align="center">Schedule Me</div>
        </div>
        <div className="fill-details-container">
                <img src={user?user.photoURL.replace(/=s\d+-c$/, "=s200-c"):user_image} alt="faculty"/>
                {user?<div>{user.displayName}</div>:<div style={{height: "30px",width: "400px",backgroundColor:"var(--color4)"}}></div>}
                {user?<div>{user.email}</div>:<div style={{height: "15px",width: "300px",backgroundColor:"var(--color4)"}}></div>}
                <div>* Please fill the details before logging in</div>
                <input ref={departmentRef} type="text" name="department" placeholder="Department . . ."/>
                <input ref={coursesRef} type="text" name="courses" placeholder="Courses . . ."/>
                <p>Ex: DBMS, OS, IIS</p>
                <div onClick={handleSaveLogin}>Save and login</div>
                <div style={{color:"red"}}>{error}</div>
        </div>
    </>
}

export default FillDetails;