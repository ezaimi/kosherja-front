import { useState } from "react";
import { Routes, Route, useNavigate, BrowserRouter } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Managers from "./scenes/admin";
import Survey from "./scenes/survey";
import FormManagers from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Buildings from "./scenes/buildings/buildings";
import Auth from "./components/Auth/auth";


function App() {

  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const navigate = useNavigate();

  // Check if the current route is "/"
  if (window.location.pathname === "/") {
    return <Auth />;
  }

  return (
  
      <ColorModeContext.Provider value={colorMode}>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
      
              {/* <Sidebar isSidebar={isSidebar}  /> */}
             


          <main className="content">
            {/* <Topbar setIsSidebar={setIsSidebar} /> */}
            <Routes>
              
              <Route path="/manager/:id" element={<Dashboard />} />
              <Route path="/manager/:id/getAllStd" element={<Team />} />
              <Route path="/admin" element={<Managers />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<FormManagers />} />
              <Route path="/survey/:formId" element={<Survey />} />              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/buildings" element={<Buildings />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
   
  
  );
}

export default App;