import { useEffect, useState } from "react";
import user_image from "../../user.png";

import { RiCloseFill } from "react-icons/ri";
import { db } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import "./faculty-home.css"
import { arrayRemove, collection, doc, getDoc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";

function FacultyHome() {

    const viewCard = (day, slot) => {
        onSnapshot(doc(db, "faculty_slots", getAuth().currentUser.email, day, "active_times"), (doc) => {
            setActiveTimes(doc.data()?.slots);
            setWaiting(doc.data()?.waiting);
        })
        var studentFaculty = document.getElementById("student-faculty");
        var popupBackground = document.getElementById("popup-background");
        var popup = document.getElementById("popup");
        // studentFaculty.style.filter = "blur(3px)";
        popupBackground.style.visibility = "visible";
        popup.style.visibility = "visible";
        setSlot(slot);
        setDay(day);
    }

    const closePopup = () => {
        var studentFaculty = document.getElementById("student-faculty");
        var popupBackground = document.getElementById("popup-background");
        var popup = document.getElementById("popup");
        studentFaculty.style.filter = "unset";
        popupBackground.style.visibility = "hidden";
        popup.style.visibility = "hidden";
    }

    const cancelSlot = () => {
        var studentFaculty = document.getElementById("student-faculty");
        var popupBackground = document.getElementById("popup-background");
        var popup = document.getElementById("popup");
        studentFaculty.style.filter = "unset";
        popupBackground.style.visibility = "hidden";
        popup.style.visibility = "hidden";
        const time = (slot.time.split(' ')[0]).toString();
        const email = getAuth().currentUser.email;
        updateDoc(doc(db, "faculty_slots", email, day, time), {
            status: "Cancelled",
        }, { merge: true });
        waiting.splice(activeTimes.indexOf(time),1);
        updateDoc(doc(db, "faculty_slots", email, day, "active_times"), {
            slots: arrayRemove(time),
            waiting: waiting
        }, { merge: true });
        for (const student_email of slot.student_emails) {
            updateDoc(doc(db, "students_slots", student_email, day, time), {
                status: 'Cancelled',
            }, { merge: true });
            updateDoc(doc(db, "students_slots", student_email, day, "active_times"), {
                faculty: arrayRemove(email),
                slots: arrayRemove(time)
            }, { merge: true })
        }
    }

    const [Monday, setMonday] = useState();
    const [Tuesday, setTuesday] = useState();
    const [Wednesday, setWednesday] = useState();
    const [Thursday, setThursday] = useState();
    const [Friday, setFriday] = useState();

    const [day, setDay] = useState("");
    const [slot, setSlot] = useState({});
    const [waiting, setWaiting] = useState([]);
    const [activeTimes, setActiveTimes] = useState([]);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    useEffect(() => {
        getAuth().onAuthStateChanged((user) => {
            for (const day of days) {
                onSnapshot(collection(db, "faculty_slots", user.email, day), (res) => {
                    const docs = res.docs;
                    const x = [];
                    const desiredOrder = ["8", "9", "10", "11", "1", "2", "3", "4"];
                    docs.sort((a, b) => {
                        const indexA = desiredOrder.indexOf(a.id);
                        const indexB = desiredOrder.indexOf(b.id);
                        if (indexA < indexB) {
                            return -1;
                        } else if (indexA > indexB) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });

                    for (const doc of docs) {
                        if (doc.id !== "active_times") {
                            x.push({ time: (doc.id + " - " + (+doc.id + 1).toString() + (doc.id < 8 ? " pm" : " am")), student_emails: doc.data().emails, student_images: doc.data().imageURLs, student_names: doc.data().names, status: doc.data().status })
                        }
                    }
                    day === "Monday" ? setMonday(x) : day === "Tuesday" ? setTuesday(x) : day === "Wednesday" ? setWednesday(x) : day === "Thursday" ? setThursday(x) : setFriday(x);
                })
            }
        })
    }, [])

    return (
        <div className="student-home-container">
            <div className="student-faculty" id="student-faculty">
                {days.map((day, i) => (<>
                    <div key={day}>{day}</div>
                    {
                        day === "Monday" ?
                            <div className="student-faculty-cards">
                                {Monday ? (Monday.length ? Monday.map((slot, i) => (
                                    <div className="student-faculty-card" onClick={() => viewCard(day, slot)}>
                                        <div className="student-faculty-card-details">
                                            <div>scheduled day / time</div>
                                            <div>{slot.time}</div>
                                            <div>status</div>
                                            <div className={slot.status}>{slot.status}</div>
                                        </div>
                                        <div className="faculty-student-images">
                                            {slot.student_images.length ? slot.student_images.map((src, i) => (
                                                i<4?<img src={src} alt="student" className={slot.student_images.length > 1 ? "faculty-student-image" : ""} />:""
                                            )) : <img src={user_image} style={{ opacity: "0.5" }} alt="student" />}
                                        </div>
                                    </div>
                                )) : <p style={{ fontSize: "18px", color: "var(--color3)", fontFamily: "var(--text-font)", padding: "0  20px" }}>No schedules made for {day}.</p>) : <><Loading /><Loading /></>}
                            </div> :
                            day === "Tuesday" ?
                                <div className="student-faculty-cards">
                                    {Tuesday ? (Tuesday.length ? Tuesday.map((slot, i) => (
                                        <div className="student-faculty-card" onClick={() => viewCard(day, slot)}>
                                            <div className="student-faculty-card-details">
                                                <div>scheduled day / time</div>
                                                <div>{slot.time}</div>
                                                <div>status</div>
                                                <div className={slot.status}>{slot.status}</div>
                                            </div>
                                            <div className="faculty-student-images">
                                                    {slot.student_images.length ? slot.student_images.map((src, i) => (
                                                        i<4?<img src={src} alt="student" className={slot.student_images.length>1?"faculty-student-image":""}/>:""
                                                    )) : <img src={user_image} style={{ opacity: "0.5" }} alt="student" />}
                                            </div>
                                        </div>
                                    )) : <p style={{ fontSize: "18px", color: "var(--color3)", fontFamily: "var(--text-font)", padding: "0  20px" }}>No schedules made for {day}.</p>) : <><Loading /><Loading /><Loading /><Loading /></>}</div> :
                                day === "Wednesday" ?
                                    <div className="student-faculty-cards">
                                        {Wednesday ? (Wednesday.length ? Wednesday.map((slot, i) => (
                                            <div className="student-faculty-card" onClick={() => viewCard(day, slot)}>
                                                <div className="student-faculty-card-details">
                                                    <div>scheduled day / time</div>
                                                    <div>{slot.time}</div>
                                                    <div>status</div>
                                                    <div className={slot.status}>{slot.status}</div>
                                                </div>
                                                <div className="faculty-student-images">
                                                        {slot.student_images.length ? slot.student_images.map((src, i) => (
                                                            i<4?<img src={src} alt="student" className={slot.student_images.length>1?"faculty-student-image":""}/>:""
                                                        )) : <img src={user_image} style={{ opacity: "0.5" }} alt="student" />}
                                                </div>
                                            </div>
                                        )) : <p style={{ fontSize: "18px", color: "var(--color3)", fontFamily: "var(--text-font)", padding: "0  20px" }}>No schedules made for {day}.</p>) : <><Loading /><Loading /><Loading /></>} </div> :
                                    day === "Thursday" ?
                                        <div className="student-faculty-cards">
                                            {Thursday ? (Thursday.length ? Thursday.map((slot, i) => (
                                                <div className="student-faculty-card" onClick={() => viewCard(day, slot)}>
                                                    <div className="student-faculty-card-details">
                                                        <div>scheduled day / time</div>
                                                        <div>{slot.time}</div>
                                                        <div>status</div>
                                                        <div className={slot.status}>{slot.status}</div>
                                                    </div>
                                                    <div className="faculty-student-images">
                                                            {slot.student_images.length ? slot.student_images.map((src, i) => (
                                                                i<4?<img src={src} alt="student" className={slot.student_images.length>1?"faculty-student-image":""}/>:""
                                                            )) : <img src={user_image} style={{ opacity: "0.5" }} alt="student" />}
]                                                    </div>
                                                </div>
                                            )) : <p style={{ fontSize: "18px", color: "var(--color3)", fontFamily: "var(--text-font)", padding: "0  20px" }}>No schedules made for {day}.</p>) : <><Loading /><Loading /><Loading /><Loading /></>} </div> :
                                        <div className="student-faculty-cards">
                                            {Friday ? (Friday.length ? Friday.map((slot, i) => (
                                                <div className="student-faculty-card" onClick={() => viewCard(day, slot)}>
                                                    <div className="student-faculty-card-details">
                                                        <div>scheduled day / time</div>
                                                        <div>{slot.time}</div>
                                                        <div>status</div>
                                                        <div className={slot.status}>{slot.status}</div>
                                                    </div>
                                                    <div className="faculty-student-images">
                                                            {slot.student_images.length ? slot.student_images.map((src, i) => (
                                                                i<4?<img src={src} alt="student" className={slot.student_images.length>1?"faculty-student-image":""}/>:""
                                                            )) : <img src={user_image} style={{ opacity: "0.5" }} alt="student" />}
                                                    </div>
                                                </div>
                                            )) : <p style={{ fontSize: "18px", color: "var(--color3)", fontFamily: "var(--text-font)", padding: "0  20px" }}>No schedules made for {day}.</p>) : <><Loading /><Loading /></>}</div>}

                </>
                ))}

                <div className="popup-background" id="popup-background" onClick={closePopup}></div>
                <div className="faculty-student-popup" id="popup">
                    <div className="faculty-student-details">
                        <div>scheduled day / time</div>
                        <div>{day}, {slot.time}</div>
                        <div>status</div>
                        <div className={slot.status}>{slot.status}</div>
                        <div style={{ marginTop: "20px", fontSize: "20px" }}> Students</div>
                    </div>
                    <div className="faculty-students-list">
                        {slot.student_names && slot.student_names.length ? slot.student_names.map((name, i) => (
                            i < 4 ? <div className="faculty-student">
                                <div>
                                    <div>{name}</div>
                                    <div>{slot.student_emails[i]}</div>
                                </div>
                                <img
                                    src={slot.student_images[i]}
                                    alt="faculty"
                                />
                            </div> : ""
                        )) : <div style={{ fontWeight: "100", fontSize: "25px" }}>No students made appointments yet</div>}
                    </div>
                    {slot.status === "Active" ?
                        <div className="faculty-student-cancel" align="end" onClick={cancelSlot}>Cancel</div> : ""}
                </div>
            </div>
        </div>
    );
}

function Loading() {
    return <div className="student-faculty-card">
        <div className="student-faculty-card-details">
            <div>scheduled day / time</div>
            <div style={{ backgroundColor: "var(--color4)", width: "150px", height: "20px", borderRadius: "5px" }}></div>
            <div>status</div>
            <div style={{ backgroundColor: "var(--color4)", width: "100px", height: "20px", borderRadius: "5px" }}></div>
        </div>
        <div className="faculty-student-images">
            <img
                src={user_image}
                alt="faculty"
                style={{ opacity: "0.5" }}
            />
        </div>
    </div>
}

export default FacultyHome;