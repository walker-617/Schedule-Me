import { useNavigate } from "react-router-dom";
import "./student-faculty.css";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import user_image from "../../user.png"

function StudentFaculty({setTeacher}) {

    const navigate=useNavigate();
    const [faculty,setFaculty]=useState();

    function selectFaculty(doc){
        setTeacher(doc);
        navigate("faculty_slots");
    }

    useEffect(()=>{
        onSnapshot(collection(db,"faculty"),(res)=>{
            const docs=res.docs;
            setFaculty(docs);
        })
    },[])

    return <div className="student-faculties-container">
        <div className="student-faculties">
            {faculty?faculty.map((doc,i)=>(
                <div className="faculty" onClick={()=>selectFaculty(doc)} key={doc.id}>
                <img src={doc.data().imageURL}
                    alt="faculty" />
                <div>{doc.data().name}</div>
            </div>
            )):<>
            <div className="faculty">
                <img src={user_image}
                    alt="faculty" style={{opacity:"0.7"}}/>
                <div style={{backgroundColor:"var(--color4)",height:"20px",width:"250px",borderRadius:"5px"}}></div>
            </div>
            <div className="faculty">
                <img src={user_image}
                    alt="faculty" style={{opacity:"0.7"}}/>
                <div style={{backgroundColor:"var(--color4)",height:"20px",width:"250px",borderRadius:"5px"}}></div>
            </div>
            <div className="faculty">
                <img src={user_image}
                    alt="faculty" style={{opacity:"0.7"}}/>
                <div style={{backgroundColor:"var(--color4)",height:"20px",width:"250px",borderRadius:"5px"}}></div>
            </div>
            </>
            }
        </div>
    </div>;
}

export default StudentFaculty;