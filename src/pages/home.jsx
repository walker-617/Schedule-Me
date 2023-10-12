import './home.css'
import { FcGoogle } from "react-icons/fc";

function Home() {

  function handleStudent(){
    window.location.href="/student";
  }

  function handleFaculty(){
    window.location.href="/faculty";
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
        <div className="google-logo" onClick={handleStudent}>
          Sign in with <FcGoogle className="g" />
          oogle
        </div>
        <br />
        <p>Faculty</p>
        <div className="google-logo" onClick={handleFaculty}>
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
