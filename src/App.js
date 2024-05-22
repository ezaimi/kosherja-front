// import { useState } from "react";
// import { Routes, Route, useNavigate, BrowserRouter } from "react-router-dom";
// import Topbar from "./scenes/global/Topbar";
// import Sidebar from "./scenes/global/Sidebar";
// import Dashboard from "./scenes/dashboard";
// import Team from "./scenes/team";
// import Invoices from "./scenes/invoices";
// import Managers from "./scenes/admin";
// import Survey from "./scenes/survey";
// import FormManagers from "./scenes/form";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// import FAQ from "./scenes/faq";
// import Geography from "./scenes/geography";
// import { CssBaseline, ThemeProvider } from "@mui/material";
// import { ColorModeContext, useMode } from "./theme";
// import Buildings from "./scenes/buildings/buildings";
// import Auth from "./components/Auth/auth";


// function App() {

//   const [theme, colorMode] = useMode();
//   const [isSidebar, setIsSidebar] = useState(true);
//   const navigate = useNavigate();

//   // Check if the current route is "/"
//   // if (window.location.pathname === "/") {
//   //   return <Auth />;
//   // }

//   const isAuthenticated = true; // Replace this with your actual authentication logic
  
//   // If user is not authenticated, redirect to login page
//   if (!isAuthenticated) {
//     navigate("/"); // Redirect to login page
//     return null; // Render nothing until authenticated
//   }

//   return (
  
//       <ColorModeContext.Provider value={colorMode}>

//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <div className="app" style={{ width: "100vw" }}>
      
//               {/* <Sidebar isSidebar={isSidebar}  /> */}
             


//           <main className="content">
//             {/* <Topbar setIsSidebar={setIsSidebar} /> */}
//             <Routes>
//               <Route path="/" element={<Auth/>} />
//               <Route path="/manager/:id" element={<Dashboard />} />
//               <Route path="/manager/:id/getAllStd" element={<Team />} />
//               <Route path="/admin" element={<Managers />} />
//               <Route path="/invoices" element={<Invoices />} />
//               <Route path="/form" element={<FormManagers />} />
//               <Route path="/survey/:formId" element={<Survey />} />              <Route path="/pie" element={<Pie />} />
//               <Route path="/line" element={<Line />} />
//               <Route path="/faq" element={<FAQ />} />
//               <Route path="/buildings" element={<Buildings />} />
//               <Route path="/geography" element={<Geography />} />
//             </Routes>
//           </main>
//         </div>
//       </ThemeProvider>
//     </ColorModeContext.Provider>
   
  
//   );
// }


// export default App;










import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, useParams } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Managers from "./scenes/admin";
import Survey from "./scenes/survey";
import Rooms from "./scenes/room/Rooms";
import FormManagers from "./scenes/form";
import StudentMain from "./scenes/student/studentMain";
import Contract from "./scenes/contract/Contract";
import StudentRoom from "./scenes/room/StudentRoom";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Buildings from "./scenes/buildings/buildings";
import Auth from "./components/Auth/auth";
import usePagination from "@mui/material/usePagination/usePagination";

function App() {
  const [theme, colorMode] = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // State to store user role
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const [userName, setUserName] = useState(''); // Add state for userName
  const [userSurname, setUserSurname] = useState(''); // Add state for userSurname

  //const [studentId, setStudentId] = useState(''); // Add state for studentId

  const{studentId} = useParams();
 
  const navigate = useNavigate();

  useEffect(() => {
    // Assuming you check authentication from local storage or an API call
    const storedRole = localStorage.getItem('userRole');
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedUserName = localStorage.getItem('userName'); // Retrieve stored userName
    const storedUserSurname = localStorage.getItem('userSurname'); // Retrieve stored userSurname


    if (storedAuth && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      setUserName(storedUserName); // Set the userName state
      setUserSurname(storedUserSurname); // Set the userSurname state

    }
    setIsAuthChecked(true); 
  }, []);

  // Function to handle successful login
  const handleLoginSuccess = (response) => {
    setIsAuthenticated(true);
    setUserRole(response.role);
    setUserName(response.name); // Store the student's name
    setUserSurname(response.surname); // Store the student's surname


    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', response.role);
    localStorage.setItem('userName', response.name); // Also store it in localStorage
    localStorage.setItem('userSurname', response.surname); // Also store it in localStorage
  

    console.log(response);
    console.log(response.role);
    console.log(response.name);
    console.log(response.surname);
    console.log(response.id);


    // Navigate to appropriate route based on role
    if (response.role === "manager") {
      navigate(`/manager/${response.id}`);
    } else if (response.role === "admin") {
      navigate("/admin");
    } else if( response.role == "student"){
      navigate(`/student/contract/${response.id}`);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);

    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName'); // Remove stored userName
    localStorage.removeItem('userSurname'); // Remove stored userSurname


    // Navigate to login page or home page after logout
    navigate("/");
  };

  if (!isAuthChecked) {
    return null; // Render nothing or a loader while auth state is being checked
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app" style={{ width: "100vw" }}>
          <main className="content">
            <Routes>
              <Route
                path="/"
                element={<Auth onLoginSuccess={handleLoginSuccess} />}
              />
              {isAuthenticated && (
                <>{/*routes per managerin */}
                  {userRole === "manager" && (
                    <>
                    <Route path="/manager/:id" element={<Dashboard />} />
                    <Route path="/manager/:id/getAllStd" element={<Team />} />
                    </>
                  )}{/*routes per adminin */}
                  {userRole === "admin" && (
                    <>
                      <Route path="/admin" element={<Managers />} />
                      <Route path="/invoices" element={<Invoices />} />
                      <Route path="/form" element={<FormManagers />} />
                      <Route path="/buildings" element={<Buildings />} />
                      <Route path="/survey/:formId" element={<Survey />} />      
                      <Route path="/rooms" element={<Rooms />} />      

                    </>
                  )}{/*routes per studentin */}     
                   {userRole === "student" && (
                    <>
                     <Route path="/student" element={<StudentMain userName={userName} userSurname={userSurname}/>} />
                     <Route path="/student/contract/:studentId" element={<Contract />} />
                     <Route path="/room/details/:studentId" element={<StudentRoom />} />

                      {/* <Route path="/admin" element={<Managers />} />
                      <Route path="/invoices" element={<Invoices />} />
                      <Route path="/form" element={<FormManagers />} /> */}
                    </>
                  )}                  
                </>

              )}
              <Route path="*" element={<Navigate to={isAuthenticated ? "/not-found" : "/"} />} />

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
