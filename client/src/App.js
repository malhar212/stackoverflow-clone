// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import React from 'react';
import Banner from "./components/banner/banner.js"
import { LocationContextProvider } from "./components/locationContext.js";
import SideBarNav from './components/sideBarNav/sideBarNav.js';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <LocationContextProvider>
      <Banner />
      <SideBarNav />
      <ToastContainer />
    </LocationContextProvider>
  )
}

export default App;

// import React from 'react';
// import { Route, Routes } from "react-router-dom";
// import Login from "./components/pages/Login.jsx";
// import Signup from "./components/pages/Signup.jsx";
// import Home from './components/pages/Home.jsx';

// function App() {
//   return (
//     <div className="App">
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;