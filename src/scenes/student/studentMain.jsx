import { Box, Button, TextField, Grid, Select, MenuItem } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import SidebarStudent from "../global/SidebarStudent";
import Topbar from "../global/Topbar";
import { useState, useEffect } from "react";
import usePagination from "@mui/material/usePagination/usePagination";
import { useParams } from "react-router-dom";

const StudentMain = ({ userName, userSurname }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [buildings, setBuildings] = useState([]); // State to store building data

  const{studentId} = useParams();

 

  return (
    <Grid container> {/* Wrap both Sidebar and Box inside Grid container */}
      <Grid item xs={3} > {/* Define the size of Sidebar */}
        <SidebarStudent userName={userName} userSurname={userSurname} />
      </Grid>
      <Grid item  > {/* Define the size of Box */}
        <Topbar/>
        <Box m="5px" ml="-150px" mt="5px" px="100px" style={{ paddingRight: 50 }}>         
         <Header title="Main Dashboard" subtitle="Student" />

       
        </Box>
      </Grid>
    </Grid>
  );
};



export default StudentMain;
