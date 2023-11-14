import { useEffect, useRef, useState } from "react";
import { getAuth } from "firebase/auth";
import { arrayUnion, collection, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

function StudentFacultySlots({ teacher }) {

    const [studentActiveTimes, setStudentActiveTimes] = useState([]);
    const [studentActiveTeachers, setStudentActiveTeachers] = useState([]);
    const [studentActiveTimesMap, setStudentActiveTimesMap] = useState({});
    const [teacherActiveTimes, setTeacherActiveTimes] = useState([]);
    const [teacherActiveWaiting, setTeacherActiveWaiting] = useState([]);
    const [sameTeacherTime, setSameTeacherTime] = useState();
    const [sameTeacher, setSameTeacher] = useState(0);
    const [day, setDay] = useState("Monday");
    const [slot, setSlot] = useState();
    const [prev, setPrev] = useState("");
    const [waiting, setWaiting] = useState("");
    const navigate = useNavigate();
    const reasonRef = useRef();
    const [reason,setReason]=useState("");

    const handleDay = (day__) => {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
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
        setDay(day__);
    }

    useEffect(() => {
        handleDay(day);
    }, []);

    useEffect(() => {
        if (teacher && studentActiveTeachers.includes(teacher.id)) {
            setSameTeacher(1);
            const i = studentActiveTeachers.indexOf(teacher.id);
            setSameTeacherTime(studentActiveTimes[i]);
        }
    }, [teacher, studentActiveTeachers])

    useEffect(() => {
        if (!teacher) {
            navigate("../faculty")
            return;
        }
        setSameTeacher(0);
        setStudentActiveTimes([]);
        setStudentActiveTeachers([]);
        setStudentActiveTimesMap({});
        setTeacherActiveTimes([]);
        setTeacherActiveWaiting([]);
        setSameTeacherTime([]);
        setSlot("");
        setPrev("");
        const user = getAuth().currentUser;
        onSnapshot(collection(db, "students_slots", user.email, day), (res) => {
            const docs = res.docs;
            var x = {};
            for (const doc of docs) {
                if (doc.id === "active_times") {
                    setStudentActiveTimes(doc.data().slots);
                    setStudentActiveTeachers(doc.data().faculty);
                }
                else {
                    x[doc.id] = doc.data();
                }
            }
            setStudentActiveTimesMap(x);
        });
        onSnapshot(doc(db, "faculty_slots", teacher.id, day, "active_times"), (res) => {
            const data = res.data();
            setTeacherActiveTimes(data ? data.slots : []);
            setTeacherActiveWaiting(data ? data.waiting : []);
        });
    }, [day, teacher]);

    function popupReason(k, n) {
        var popupBackground = document.getElementById("popup-background");
        var popup = document.getElementById("popup");
        popupBackground.style.visibility = "visible";
        popup.style.visibility = "visible";
        setSlot(k);
        setWaiting(n);
    }

    const closePopup = () => {
        var popupBackground = document.getElementById("popup-background");
        var popup = document.getElementById("popup");
        popupBackground.style.visibility = "hidden";
        popup.style.visibility = "hidden";
        reasonRef.current.value = "";
        setReason("");
    }

    function makeAppoint() {
        const reason = reasonRef.current.value;
        const user = getAuth().currentUser;
        setDoc(doc(db, "students_slots", user.email, day, slot), {
            name: teacher.data().name,
            email: teacher.id,
            imageURL: teacher.data().imageURL,
            reason: reason,
            status: ("Waiting-list " + waiting)
        }, { merge: true });
        setDoc(doc(db, "students_slots", user.email, day, "active_times"), {
            slots: arrayUnion(slot),
            faculty: arrayUnion(teacher.id),
        }, { merge: true });
        setDoc(doc(db, "faculty_slots", teacher.id, day, slot), {
            students: arrayUnion({ email: user.email, imageURL: user.photoURL, name: user.displayName, reason: reason }),
        }, { merge: true });

        const i = teacherActiveTimes.indexOf(slot);
        teacherActiveWaiting[i]++;
        setDoc(doc(db, "faculty_slots", teacher.id, day, "active_times"), {
            waiting: teacherActiveWaiting,
        }, { merge: true })
        var x = document.getElementById("time" + slot);
        x.style.backgroundColor = "unset";
        setSlot("");
        closePopup();
    }

    return <div align="center" id="x">
        <div className="faculty-slots-container">
            <div className="faculty-slots-image-details">
                <img
                    src={teacher ? teacher.data().imageURL : ""}
                    alt="faculty"
                    className="faculty-slots-image"
                />
                <div className="faculty-slots-details">
                    <div>{teacher ? teacher.data().name : ""}</div>
                    <div>{teacher ? teacher.id : ""}</div>
                    <div>{teacher ? teacher.data().department : ""}</div>
                    <div>{teacher ? teacher.data().courses : ""}</div>
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
            {sameTeacher === 1 ? <div className="faculty-slots">
                {["8", "9", "10", "11", "1", "2", "3", "4"].map((time, i) => (
                    <div key={time} style={sameTeacherTime === time ? { backgroundColor: "var(--active)", color: "var(--color5)", cursor: "not-allowed" } : { color: "var(--color4)", cursor: "not-allowed" }} >{time + " - " + (+time + 1).toString()} <span style={sameTeacherTime === time ? { backgroundColor: "var(--active)", color: "var(--color5)", cursor: "not-allowed" } : { color: "var(--color4)", cursor: "not-allowed" }} className="am-pm">{parseInt(time)<8?"pm":"am"}</span></div>
                ))}
            </div> :
                <div className="faculty-slots">
                    {["8", "9", "10", "11", "1", "2", "3", "4"].map((time, i) => (
                        <div className="faculty-slot" key={time} style={studentActiveTimes.includes(time) ? { color: "var(--color4)", cursor: "not-allowed" } : !teacherActiveTimes.includes(time) ? { color: "var(--color4)", cursor: "not-allowed" } : {}} onClick={() => !studentActiveTimes.includes(time) ? teacherActiveTimes.includes(time) ? popupReason(time, teacherActiveWaiting[teacherActiveTimes.indexOf(time)]) : "" : ""} id={"time" + time}>
                            {time + " - " + (+time + 1).toString()}
                            <span style={studentActiveTimes.includes(time) ? { color: "var(--color4)", cursor: "not-allowed" } : !teacherActiveTimes.includes(time) ? { color: "var(--color4)", cursor: "not-allowed" } : {}} className="am-pm">
                                {" "}{parseInt(time)<8?"pm":"am"}
                            </span>
                            <span className="waiting-tag">
                                {!studentActiveTimes.includes(time) ? teacherActiveTimes.includes(time) && teacherActiveWaiting[teacherActiveTimes.indexOf(time)] > "3" ? "WL - " + (teacherActiveWaiting[teacherActiveTimes.indexOf(time)] - "3") : "" : <img src={studentActiveTimesMap[time].imageURL} alt="faculty" style={{ height: "20px", borderRadius: "30px" }} />}
                            </span>
                        </div>
                    ))}
                </div>
            }
            <div className="popup-background" id="popup-background" onClick={closePopup}></div>
            <div className="student-faculty-slots-popup" id="popup">
                <div>You are about to make appointment</div>
                <div>with</div>
                <div>{teacher ? teacher.data().name : ""}</div>
                <div>on</div>
                <div>{day}</div>
                <div>at</div>
                <div>{slot + " - " + (+slot + 1).toString() + (slot < 8 ? " pm" : " am")}</div>
                <div>Please state the reason below</div>
                <textarea ref={reasonRef} onChange={(e)=>{setReason(e.target.value)}} placeholder="Reason..." autoFocus={true}></textarea>
                {reason?<div className="make-appoint" onClick={makeAppoint}>Make appointment</div>:""}
            </div>
        </div>
    </div>
}

export default StudentFacultySlots;
