import "./home.css";
import { FcGoogle } from "react-icons/fc";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // getAuth().onAuthStateChanged((user) => {
    //   if (user) {
    //     if (user.email.endsWith("@nitc.ac.in")) {
    //       navigate("/faculty");
    //     } else {
    //       navigate("/student");
    //     }
    //   }
    // });
  }, []);

  function handleSignIn(route) {
    signInWithPopup(getAuth(), new GoogleAuthProvider()).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      const email = user.email;
      if (route === "student") {
        navigate("/student");
      } else {
        if (email.endsWith("@nitc.ac.in")) {
          const docRef = doc(db, "faculty", email);
          getDoc(docRef)
            .then((res) => {
              if (res.exists()) {
                navigate("/faculty");
              } else {
                navigate("/fill_details");
              }
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log("error occured in home page");
            });
        } else {
          navigate("/unauth_access");
        }
      }
    });
  }

  return (
    <div className="home-container">
      <div className="home-page-title">
        <div>Schedule Me</div>
        <div>Appointments made easy.</div>
      </div>
      <div className="home-signin">
        <p>Login as</p>
        <br />
        <p>Student</p>
        <div className="google-logo" onClick={() => handleSignIn("student")}>
          Sign in with <FcGoogle className="g" />
          oogle
        </div>
        <br />
        <p>Faculty</p>
        <div className="google-logo" onClick={() => handleSignIn("faculty")}>
          Sign in with <FcGoogle className="g" />
          oogle
        </div>
      </div>
      <div className="home-page-about">
        Welcome to Schedule Me, your all-in-one solution for streamlined
        appointment scheduling. Our web application offers an array of features
        designed to simplify your life. With Schedule Me, you can seamlessly
        manage your appointment slots using our intuitive status tracking
        system. What sets us apart? We ensure everyone stays informed by sending
        timely email notifications to students about slot updates. Whether
        you're a student looking to book a meeting with faculty or an academic
        professional seeking to streamline your schedule, Schedule Me is here to
        elevate your appointment experience.
      </div>
    </div>
  );
}

export default Home;
