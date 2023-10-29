import { useEffect, useRef, useState } from "react";
import "./faculty-slots.css";
import { getAuth } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import user_image from "../../user.png";
import {FiEdit3} from "react-icons/fi";
import {FaCheck} from "react-icons/fa6";
import {RxCross1} from "react-icons/rx";

function FacultySlots() {
    var [user, setUser] = useState();
    const [day, setDay] = useState("Monday");
    const [slots, setSlots] = useState(new Set());
    const [activeSlots,setActiveSlots]=useState(new Set());
    const [waiting,setWaiting]=useState([]);
    const [editDepartment,setEditDepartment]=useState(0);
    const [editCourses,setEditCourses]=useState(0);
    const [department,setDepartment]=useState("");
    const [courses,setCourses]=useState("");

    const make_active={backgroundColor:"var(--active)",color:"var(--color5)",cursor:"not-allowed"};

    function handleDay(day__) {
        setSlots(new Set());
        const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
        for (const day_ of days) {
            const x = document.getElementById(day_);
            x.style.color = "var(--color3)";
        }
        const slider = document.getElementById('day-slider');
        const navItem = document.getElementById(day__);
        const sliderWidth = navItem.offsetWidth;
        const sliderLeftOffset = navItem.offsetLeft;
        const leftPosition = sliderLeftOffset;
        slider.style.width = sliderWidth + 'px';
        slider.style.transform = `translateX(${leftPosition}px)`;
        navItem.style.color = "var(--color1)";
        setDay(day__)
    }

    useEffect(()=>{
        handleDay(day);
    },[]);

    useEffect(() => {
        getAuth().onAuthStateChanged((User) => {
            onSnapshot(doc(db, "faculty", User.email),(res) => {
                    user = res.data();
                    user.email = User.email;
                    setUser(user);
                    setDepartment(user.department);
                    setCourses(user.courses);
                });
            onSnapshot(doc(db,"faculty_slots",User.email,day,"active_times"),(res)=>{
                const data=res.data();
                setActiveSlots(data?(new Set(data.slots)):(new Set()));
                setWaiting(data?data.waiting:[]);
            });
        });
    }, [day]);

    function toggleSlot(k) {
        const updatedSet = new Set(slots);
        if (slots.has(k)) {
            updatedSet.delete(k);
            var x = document.getElementById("time" + k);
            x.style.backgroundColor = "unset";
        }
        else {
            updatedSet.add(k);
            x = document.getElementById("time" + k);
            x.style.backgroundColor = "var(--color4)";
        }
        setSlots(updatedSet);
    }

    function makeAvail(){
        for(const time of slots)
        {
            setDoc(doc(db,"faculty_slots",user.email,day,time),{
                students:[],
                status: "Active"
            })
            activeSlots.add(time);
            waiting.push(0);
        }
        setDoc(doc(db,"faculty_slots",user.email,day,"active_times"),{
            slots: Array.from(activeSlots),
            waiting: waiting
        })
        setSlots(new Set());
        setActiveSlots(activeSlots);
        setWaiting(waiting);
    }

    function handleDepartment(){
        setDoc(doc(db,"faculty",user.email),{
            department: department
        },{merge:true})
        setEditDepartment(false);
        setDepartment(department);
    }

    function handleCourses(){
        setDoc(doc(db,"faculty",user.email),{
            courses: courses
        },{merge:true})
        setEditCourses(false);
        setCourses(courses);
    }

    return <div align="center">
        <div className="faculty-slots-container">
            <div className="faculty-slots-image-details">
                <img
                    src={user ? user.imageURL : user_image}
                    alt="faculty"
                    className="faculty-slots-image"
                />
                <div className="faculty-slots-details">
                    {user ? <>
                        <div>{user.name}</div>
                        <div>{user.email}</div>
                        {!editDepartment?
                        <div>{user.department} <FiEdit3 className="edit-icon" onClick={()=>{setEditDepartment(true);setDepartment(user.department)}}/></div>:
                        <div><input value={department} onChange={(e)=>setDepartment(e.target.value)} className="edit-input" type="text"  placeholder="Enter department..." /> {user.department!==department.trim() && department?<FaCheck style={{color:"var(--color5)",backgroundColor:"var(--active)"}} className="edit-icon"  onClick={handleDepartment}/>:""} <RxCross1 style={{color:"var(--color5)",backgroundColor:"var(--cancelled)"}} className="edit-icon"  onClick={()=>setEditDepartment(false)}/></div>}       
                        {!editCourses?
                        <div>{user.courses} <FiEdit3 className="edit-icon" onClick={()=>{setEditCourses(true);setCourses(user.courses)}}/></div>:
                        <div><input value={courses} onChange={(e)=>setCourses(e.target.value)} className="edit-input" type="text"  placeholder="Enter department..."  /> {user.courses!==courses.trim() && courses?<FaCheck style={{color:"var(--color5)",backgroundColor:"var(--active)"}} className="edit-icon"  onClick={handleCourses}/>:""} <RxCross1 style={{color:"var(--color5)",backgroundColor:"var(--cancelled)"}} className="edit-icon"  onClick={()=>setEditCourses(false)}/></div>}       
                        </>:<>
                        <div style={{ height: "30px", width: "400px", backgroundColor: "var(--color4)", borderRadius: "10px" }}></div>
                        <div style={{ height: "20px", width: "300px", backgroundColor: "var(--color4)", borderRadius: "5px" }}></div>
                        <div style={{ height: "15px", width: "200px", backgroundColor: "var(--color4)", borderRadius: "5px" }}></div>
                        <div style={{ height: "15px", width: "200px", backgroundColor: "var(--color4)", borderRadius: "5px" }}></div> </>}
                </div>
            </div>
            <div className="faculty-slots-days">
                <div id="Monday" onClick={() => handleDay("Monday")}>Monday</div>
                <div id="Tuesday" onClick={() => handleDay("Tuesday")}>Tuesday</div>
                <div id="Wednesday" onClick={() => handleDay("Wednesday")}>Wednesday</div>
                <div id="Thursday" onClick={() => handleDay("Thursday")}>Thursday</div>
                <div id="Friday" onClick={() => handleDay("Friday")}>Friday</div>
                <div id="day-slider"></div>
            </div>
            <div className="faculty-slots">
                <div style={activeSlots.has("8")?make_active:{}} onClick={() => !activeSlots.has("8")?toggleSlot("8"):""} id="time8">8 - 9 <span style={activeSlots.has("8")?make_active:{}} className="am-pm">am</span></div>
                <div style={activeSlots.has("9")?make_active:{}} onClick={() => !activeSlots.has("9")?toggleSlot("9"):""} id="time9">9 - 10 <span style={activeSlots.has("9")?make_active:{}} className="am-pm">am</span></div>
                <div style={activeSlots.has("10")?make_active:{}} onClick={() => !activeSlots.has("10")?toggleSlot("10"):""} id="time10">10 -11 <span style={activeSlots.has("10")?make_active:{}} className="am-pm">am</span></div>
                <div style={activeSlots.has("11")?make_active:{}} onClick={() => !activeSlots.has("11")?toggleSlot("11"):""} id="time11">11 - 12 <span style={activeSlots.has("11")?make_active:{}} className="am-pm">am</span></div>
                <div style={activeSlots.has("1")?make_active:{}} onClick={() => !activeSlots.has("1")?toggleSlot("1"):""} id="time1">1 - 2 <span style={activeSlots.has("1")?make_active:{}} className="am-pm">pm</span></div>
                <div style={activeSlots.has("2")?make_active:{}} onClick={() => !activeSlots.has("2")?toggleSlot("2"):""} id="time2">2 - 3 <span style={activeSlots.has("2")?make_active:{}} className="am-pm">pm</span></div>
                <div style={activeSlots.has("3")?make_active:{}} onClick={() => !activeSlots.has("3")?toggleSlot("3"):""} id="time3">3 - 4 <span style={activeSlots.has("3")?make_active:{}} className="am-pm">pm</span></div>
                <div style={activeSlots.has("4")?make_active:{}} onClick={() => !activeSlots.has("4")?toggleSlot("4"):""} id="time4">4 - 5 <span style={activeSlots.has("4")?make_active:{}} className="am-pm">pm</span></div>
            </div>
            {slots.size?<div className="make-avail" onClick={()=>makeAvail()}>Make available</div>:""}
        </div>
    </div>
};

export default FacultySlots;