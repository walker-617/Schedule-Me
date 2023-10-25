import './home.css'
import { FcGoogle } from "react-icons/fc";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom"

function Home() {

  const navigate = useNavigate();

  function handleSignIn(route) {
    signInWithPopup(getAuth(), new GoogleAuthProvider())
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        const email = user.email;
        if (route === "student") {
          navigate("/student");
        }
        else {
          const docRef = doc(db, "faculty", email);
          getDoc(docRef)
            .then((res) => {
              if (res.exists()) {
                navigate("/faculty");
              }
              else {
                navigate("/fill_details");
              }
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log("error occured in home page");
            });
        }
      }
    )}

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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor,
        libero in auctor faucibus, purus sapien tincidunt nulla, eget suscipit
        justo ex in ante. Donec pharetra lacus id justo ultricies, at finibus
        justo volutpat. Fusce congue, urna in vehicula dapibus, odio lectus
        mattis risus, nec volutpat ante lorem id arcu. Vivamus id iaculis neque.
        Proin non orci in felis facilisis consequat. Integer vehicula congue
        massa, at malesuada ipsum fringilla ut. Sed nec fringilla massa, eget
        sagittis ex. Vestibulum id quam id justo posuere euismod. Vivamus
        efficitur, odio vel fringilla vehicula, sapien ex convallis nisl, in
        auctor felis lorem non sapien. Integer mattis nulla nec risus facilisis
        feugiat.
      </div>
    </div>
  );
}

export default Home;
