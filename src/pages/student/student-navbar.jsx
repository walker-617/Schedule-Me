import { HiHome } from "react-icons/hi";
import { FaUsers } from "react-icons/fa";
import { MdRunCircle } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import user_image from "../../user.png";
import { useState } from "react";

function Studentnavbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [show, setShow] = useState(false);

  function handleMenu(n) {
    const slider = document.getElementById("slider");
    const navItem = document.getElementById("nav-item" + n);
    const sliderWidth = navItem.offsetWidth;
    const sliderLeftOffset = navItem.offsetLeft;
    const leftPosition = sliderLeftOffset;
    slider.style.width = sliderWidth + "px";
    slider.style.transform = `translateX(${leftPosition}px)`;
    if (n === 2) {
      getAuth()
        .signOut()
        .then(() => {
          navigate("/");
        });
    }
  }

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
      } else {
        setUser(user);
      }
    });
  }, []);

  return (
    <>
      <div className="student-navbar">
        <div className="student-navbar-title">
          Schedule Me | <span style={{ fontSize: "25px" }}>Student Portal</span>
        </div>
        <div className="student-navbar-items">
          <Link to="home">
            <div
              className="nav-item"
              id="nav-item0"
              onClick={() => handleMenu(0)}
            >
              {" "}
              <HiHome className="navbar-icon" /> Home{" "}
            </div>
          </Link>
          <Link to="faculty">
            <div
              className="nav-item"
              id="nav-item1"
              onClick={() => handleMenu(1)}
            >
              {" "}
              <FaUsers className="navbar-icon" /> Faculty{" "}
            </div>
          </Link>
          <div
            className="nav-item"
            id="nav-item2"
            onClick={() => handleMenu(2)}
          >
            {" "}
            Logout <MdRunCircle className="navbar-icon-logout" />{" "}
          </div>
          <div className="profile-container">
            <img
              className="profile"
              src={user ? user.photoURL : user_image}
              onClick={() => setShow(true)}
            />
            {show && (
              <div className="profile-popup">
                <img
                  className="pop-img"
                  src={user ? user.photoURL : user_image}
                />
                <div className="pop-info">
                  <p>{user?.displayName}</p>
                  <p>{user?.email}</p>
                </div>
                <ImCross className="pop-close" onClick={() => setShow(false)} />
              </div>
            )}
          </div>
          <div id="slider"></div>
        </div>
      </div>
    </>
  );
}

export default Studentnavbar;
