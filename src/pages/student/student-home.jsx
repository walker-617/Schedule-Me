import { useEffect, useState } from "react";
import user_image from "../../user.png";

import { RiCloseFill } from "react-icons/ri";
import { db } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import "./student-home.css"
import { arrayRemove, collection, doc, getDoc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";

function StudentHome() {

  const viewCard = (day, slot) => {
    onSnapshot(doc(db, "faculty", slot.teacher_email), (res) => {
      var data = res.data();
      data.email = res.id;
      data.day = day;
      data.time = slot.time;
      data.status = slot.status;
      setSlot(data);
      onSnapshot(collection(db, "faculty_slots", slot.teacher_email, day), (res) => {
        const docs = res.docs;
        for (const doc of docs) {
          const data = doc.data();
          if (doc.id === "active_times") {
            setTeacherActiveTimes(data ? data.slots : []);
            setTeacherActiveWaiting(data ? data.waiting : []);
          }
          else if (doc.id === slot.time.split(' ')[0]) {
            setSlotEmails(data.emails);
          }
        }
      })
    })
    setDay(day);
    var studentFaculty = document.getElementById("student-faculty");
    var popupBackground = document.getElementById("popup-background");
    var popup = document.getElementById("popup");
    // studentFaculty.style.filter = "blur(3px)";
    popupBackground.style.visibility = "visible";
    popup.style.visibility = "visible";
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
    const user = getAuth().currentUser;

    updateDoc(doc(db, "students_slots", user.email, day, "active_times"), {
      slots: arrayRemove(slot.time.split(' ')[0]),
      faculty: arrayRemove(slot.email)
    }, { merge: true });

    updateDoc(doc(db, "faculty_slots", slot.email, day, slot.time.split(' ')[0]), {
      emails: arrayRemove(user.email),
      names: arrayRemove(user.displayName),
      imageURLs: arrayRemove(user.photoURL)
    }, { merge: true });

    var count = 0;
    for (const email of slotEmails) {
      if (email !== user.email) {
        console.log(email, count);
        updateDoc(doc(db, "students_slots", email, day, slot.time.split(' ')[0]), {
          status: ("Waiting-list " + count)
        }, { merge: true });
        count++;
      }
      else {
        updateDoc(doc(db, "students_slots", email, day, slot.time.split(' ')[0]), {
          status: "Cancelled",
        }, { merge: true });
      }
    }

    const i = teacherActiveTimes.indexOf(slot.time.split(' ')[0]);
    teacherActiveWaiting[i]--;
    updateDoc(doc(db, "faculty_slots", slot.email, day, "active_times"), {
      waiting: teacherActiveWaiting
    }, { merge: true });
  }

  const [Monday, setMonday] = useState();
  const [Tuesday, setTuesday] = useState();
  const [Wednesday, setWednesday] = useState();
  const [Thursday, setThursday] = useState();
  const [Friday, setFriday] = useState();
  const [teacherActiveWaiting, setTeacherActiveWaiting] = useState([]);
  const [teacherActiveTimes, setTeacherActiveTimes] = useState([]);
  const [slotEmails, setSlotEmails] = useState([]);

  const [day, setDay] = useState("");
  const [slot, setSlot] = useState({});

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      for (const day of days) {
        onSnapshot(collection(db, "students_slots", user.email, day), (res) => {
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
              x.push({ time: (doc.id + " - " + (+doc.id + 1).toString() + (doc.id < 8 ? " pm" : " am")), teacher_email: doc.data().email, teacher_image: doc.data().imageURL, teacher_name: doc.data().name, status: doc.data().status })
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
                      <div>name</div>
                      <div>{slot.teacher_name}</div>
                      <div>scheduled day / time</div>
                      <div>{slot.time}</div>
                      <div>status</div>
                      {slot.status.split(" ")[0] === "Waiting-list" && slot.status.split(" ")[1] < "4" ?
                        <div className="Active">Active</div> :
                        <div className={slot.status}>{slot.status.split(" ")[0] === "Waiting-list" ? slot.status.split(" ")[0].replace("-", " ") + " " + (slot.status.split(" ")[1] - "3") : slot.status}</div>}
                    </div>
                    <div className="faculty-student-images">
                      {slot.teacher_image ?
                        <img src={slot.teacher_image} alt="faculty" />
                        : <img src={user_image} style={{ opacity: "0.5" }} alt="faculty" />}
                    </div>
                  </div>
                )) : <p style={{ fontSize: "18px", color: "var(--color3)", fontFamily: "var(--text-font)", padding: "0  20px" }}>No schedules made for {day}.</p>) : <><Loading /><Loading /></>}
              </div> :
              day === "Tuesday" ?
                <div className="student-faculty-cards">
                  {Tuesday ? (Tuesday.length ? Tuesday.map((slot, i) => (
                    <div className="student-faculty-card" onClick={() => viewCard(day, slot)}>
                      <div className="student-faculty-card-details">
                        <div>name</div>
                        <div>{slot.teacher_name}</div>
                        <div>scheduled day / time</div>
                        <div>{slot.time}</div>
                        <div>status</div>
                        {slot.status.split(" ")[0] === "Waiting-list" && slot.status.split(" ")[1] < "4" ?
                          <div className="Active">Active</div> :
                          <div className={slot.status}>{slot.status.split(" ")[0] === "Waiting-list" ? slot.status.split(" ")[0].replace("-", " ") + " " + (slot.status.split(" ")[1] - "3") : slot.status}</div>}
                      </div>
                      <div className="faculty-student-images">
                        {slot.teacher_image ?
                          <img src={slot.teacher_image} alt="faculty" />
                          : <img src={user_image} style={{ opacity: "0.5" }} alt="faculty" />}
                      </div>
                    </div>
                  )) : <p style={{ fontSize: "18px", color: "var(--color3)", fontFamily: "var(--text-font)", padding: "0  20px" }}>No schedules made for {day}.</p>) : <><Loading /><Loading /><Loading /><Loading /></>}</div> :
                day === "Wednesday" ?
                  <div className="student-faculty-cards">
                    {Wednesday ? (Wednesday.length ? Wednesday.map((slot, i) => (
                      <div className="student-faculty-card" onClick={() => viewCard(day, slot)}>
                        <div className="student-faculty-card-details">
                          <div>name</div>
                          <div>{slot.teacher_name}</div>
                          <div>scheduled day / time</div>
                          <div>{slot.time}</div>
                          <div>status</div>
                          {slot.status.split(" ")[0] === "Waiting-list" && slot.status.split(" ")[1] < "4" ?
                            <div className="Active">Active</div> :
                            <div className={slot.status}>{slot.status.split(" ")[0] === "Waiting-list" ? slot.status.split(" ")[0].replace("-", " ") + " " + (slot.status.split(" ")[1] - "3") : slot.status}</div>}
                        </div>
                        <div className="faculty-student-images">
                          {slot.teacher_image ?
                            <img src={slot.teacher_image} alt="faculty" />
                            : <img src={user_image} style={{ opacity: "0.5" }} alt="faculty" />}
                        </div>
                      </div>
                    )) : <p style={{ fontSize: "18px", color: "var(--color3)", fontFamily: "var(--text-font)", padding: "0  20px" }}>No schedules made for {day}.</p>) : <><Loading /><Loading /><Loading /></>} </div> :
                  day === "Thursday" ?
                    <div className="student-faculty-cards">
                      {Thursday ? (Thursday.length ? Thursday.map((slot, i) => (
                        <div className="student-faculty-card" onClick={() => viewCard(day, slot)}>
                          <div className="student-faculty-card-details">
                            <div>name</div>
                            <div>{slot.teacher_name}</div>
                            <div>scheduled day / time</div>
                            <div>{slot.time}</div>
                            <div>status</div>
                            {slot.status.split(" ")[0] === "Waiting-list" && slot.status.split(" ")[1] < "4" ?
                              <div className="Active">Active</div> :
                              <div className={slot.status}>{slot.status.split(" ")[0] === "Waiting-list" ? slot.status.split(" ")[0].replace("-", " ") + " " + (slot.status.split(" ")[1] - "3") : slot.status}</div>}
                          </div>
                          <div className="faculty-student-images">
                            {slot.teacher_image ?
                              <img src={slot.teacher_image} alt="faculty" />
                              : <img src={user_image} style={{ opacity: "0.5" }} alt="faculty" />}
                          </div>
                        </div>
                      )) : <p style={{ fontSize: "18px", color: "var(--color3)", fontFamily: "var(--text-font)", padding: "0  20px" }}>No schedules made for {day}.</p>) : <><Loading /><Loading /><Loading /><Loading /></>} </div> :
                    <div className="student-faculty-cards">
                      {Friday ? (Friday.length ? Friday.map((slot, i) => (
                        <div className="student-faculty-card" onClick={() => viewCard(day, slot)}>
                          <div className="student-faculty-card-details">
                            <div>name</div>
                            <div>{slot.teacher_name}</div>
                            <div>scheduled day / time</div>
                            <div>{slot.time}</div>
                            <div>status</div>
                            {slot.status.split(" ")[0] === "Waiting-list" && slot.status.split(" ")[1] < "4" ?
                              <div className="Active">Active</div> :
                              <div className={slot.status}>{slot.status.split(" ")[0] === "Waiting-list" ? slot.status.split(" ")[0].replace("-", " ") + " " + (slot.status.split(" ")[1] - "3") : slot.status}</div>}
                          </div>
                          <div className="faculty-student-images">
                            {slot.teacher_image ?
                              <img src={slot.teacher_image} alt="faculty" />
                              : <img src={user_image} style={{ opacity: "0.5" }} alt="faculty" />}
                          </div>
                        </div>
                      )) : <p style={{ fontSize: "18px", color: "var(--color3)", fontFamily: "var(--text-font)", padding: "0  20px" }}>No schedules made for {day}.</p>) : <><Loading /><Loading /></>}</div>}

        </>
        ))}

        <div className="popup-background" id="popup-background" onClick={closePopup}></div>
        <div className="student-faculty-popup" id="popup">
          <div className="student-faculty-popup-details">
            <div>name</div>
            <div>{slot.name}</div>
            <div>email</div>
            <div>{slot.email}</div>
            <div>department</div>
            <div>{slot.department}</div>
            <div>courses</div>
            <div>{slot.courses}</div>
            <div>scheduled day / time</div>
            <div>{slot.day}, {slot.time}</div>
            <div>status</div>
            {slot.status?.split(" ")[0] === "Waiting-list" && slot.status?.split(" ")[1] < "4" ?
              <div className="Active">Active</div> :
              <div className={slot.status}>{slot.status?.split(" ")[0] === "Waiting-list" ? slot.status?.split(" ")[0].replace("-", " ") + " " + (slot.status?.split(" ")[1] - "3") : slot.status}</div>}
            {slot.status?.split(" ")[0] === "Waiting-list" ? <div className="student-faculty-cancel" align="end" onClick={cancelSlot}>Cancel</div> : ""}
          </div>
          <img
            src={slot.imageURL}
            alt="faculty"
            className="student-faculty-popup-image"
          />
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

export default StudentHome;