import React from 'react'
// import { useEffect, useState } from "react";
// import { useCookies } from "react-cookie";
// import { useLocationContext } from '../locationContext';
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';

const Home = () => {
    let username;
    let Logout;
    // const { setPageAndParams } = useLocationContext();
//   const navigate = useNavigate();
//   const [cookies, removeCookie] = useCookies([]);
//   const [username, setUsername] = useState("");
//   useEffect(() => {
//     const verifyCookie = async () => {
//       if (!cookies.token) {
//         setPageAndParams('auth/login');
//       }
    //   const { data } = await axios.post(
    //     "http://localhost:3000",
    //     {},
    //     { withCredentials: true }
    //   );
    //   const { status, user } = data;
    //   setUsername(user);
    //   return status
    //     ? toast(`Hello ${user}`, {
    //         position: "top-right",
    //       })
    //     : (removeCookie("token"), setPageAndParams('auth/login'));
    // };
//     verifyCookie();
//   }, [cookies, removeCookie]);
//   const Logout = () => {
//     removeCookie("token");
//     setPageAndParams('auth/signup');
//   };
  return (
    <>
      <div className="home_page">
        <h4>
          {" "}
          Welcome Welcome Welcome Welcome <span>{ username ? "username" : "no username" }</span>
        </h4>
        <button onClick={Logout ? "true" : "false"}>LOGOUT</button>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;