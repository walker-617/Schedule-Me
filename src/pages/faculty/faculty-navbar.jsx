import { HiHome } from "react-icons/hi";
import { BsUiChecksGrid } from "react-icons/bs";
import { MdRunCircle } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import user_image from "../../user.png"

function Facultynavbar() {

    const navigate=useNavigate();
    const [image,setImage]=useState();

    function handleMenu(n) {
        const slider = document.getElementById('slider');
        const navItem = document.getElementById('nav-item' + n);
        const sliderWidth = navItem.offsetWidth;
        const sliderLeftOffset = navItem.offsetLeft;
        const leftPosition = sliderLeftOffset;
        slider.style.width = sliderWidth + 'px';
        slider.style.transform = `translateX(${leftPosition}px)`;
        if(n===2)
        {
            getAuth().signOut().then(()=>{
                navigate("/");
            });
        }
    }

    useEffect(()=>{
        getAuth().onAuthStateChanged((user)=>{
            setImage(user.photoURL);
        })
    },[])

    return (
        <>
            <div className="student-navbar">
                <div className='student-navbar-title'>Schedule Me</div>
                <div className='student-navbar-items'>
                    <Link to="home"><div className='nav-item' id="nav-item0" onClick={() => handleMenu(0)}> <HiHome className="navbar-icon" /> Home </div></Link>
                    <Link to="slots"><div className='nav-item' id="nav-item1" onClick={() => handleMenu(1)}> <BsUiChecksGrid className='navbar-icon' />  Slots</div></Link>
                    <div className='nav-item' id="nav-item2" onClick={() => handleMenu(2)}>  Logout <MdRunCircle className='navbar-icon-logout' /> </div>
                    <img className='profile' src={image?image:user_image} />
                    <div id="slider"></div>
                </div>
            </div>
        </>

    );
}

export default Facultynavbar;