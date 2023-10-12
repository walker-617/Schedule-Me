import StudentHome from "./student-home";
import StudentFaculty from "./student-faculty";
import StudentStatus from "./student-status";

import { HiHome } from "react-icons/hi";
import { FaUsers } from "react-icons/fa";
import { BsListNested } from "react-icons/bs";
import { MdRunCircle } from "react-icons/md";

function Studentnavbar(){
    function handleMenu(n) {
        const slider = document.getElementById('slider');
        const navItem = document.getElementById('nav-item' + n);
        const sliderWidth = navItem.offsetWidth;
        const sliderLeftOffset = navItem.offsetLeft;
        const leftPosition = sliderLeftOffset;
        slider.style.width = sliderWidth + 'px';
        slider.style.transform = `translateX(${leftPosition}px)`;
    }

    return (
        <>
            <div className="student-navbar">
                <div className='student-navbar-title'>Schedule Me</div>
                <div className='student-navbar-items'>
                    <div className='nav-item' id="nav-item0" onClick={() => handleMenu(0)}> <HiHome className="navbar-icon" /> Home </div>
                    <div className='nav-item' id="nav-item1" onClick={() => handleMenu(1)}> <FaUsers className='navbar-icon' /> Faculty </div>
                    <div className='nav-item' id="nav-item2" onClick={() => handleMenu(2)}> <BsListNested className='navbar-icon' /> Status </div>
                    <div className='nav-item' id="nav-item3" onClick={() => handleMenu(3)}>  Logout <MdRunCircle className='navbar-icon-logout' /> </div>
                    <div id="slider"></div>
                </div>
            </div>
        </>

    );
}

export default Studentnavbar;