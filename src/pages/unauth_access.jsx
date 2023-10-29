import {BsBoxArrowUpRight} from "react-icons/bs";
import {BiSolidError} from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

function UnauthAccess(){

    const navigate=useNavigate();

    return <>
        <div className="fill-details-navbar">
            <div className='student-navbar-title' align="center">Schedule Me</div>
        </div>
        <div className="page-not-found">
            <BiSolidError/>
            <div>Unauthorised access</div>
            <div onClick={()=>getAuth().signOut().then(()=>{
                navigate("/");
            })}>go to Home <BsBoxArrowUpRight/></div>
        </div>
    </>
}

export default UnauthAccess;