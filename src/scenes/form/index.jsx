import { Box, Button, TextField, Grid, Select, MenuItem } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import Sidebar from "../global/Sidebar";
import Topbar from "../global/Topbar";
import { useState, useEffect } from "react";

const FormManagers = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [buildings, setBuildings] = useState([]); // State to store building data

  useEffect(() => {
    // Function to fetch building data from the database
    const fetchBuildings = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/building/count");
        console.log("JJJ");
        if (!response.ok) {
          throw new Error("Failed to fetch buildings");
        }
        const data = await response.json();
        setBuildings(data); // Store retrieved building data in state
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };

    fetchBuildings(); // Call the function to fetch buildings when component mounts
  }, []);

  const handleFormSubmit = async (values) => {
    console.log("Brenda");
    try {
      console.log("Form values:", values);

      const response = await fetch("http://localhost:8080/api/manager/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create manager");
      }
  
      const data = await response.json();
      console.log("Manager created:", data);
    } catch (error) {
      console.error("Error creating manager:", error);
    }
  };

  return (
    <Grid container> {/* Wrap both Sidebar and Box inside Grid container */}
      <Grid item xs={3} > {/* Define the size of Sidebar */}
        <Sidebar/>
      </Grid>
      <Grid item  > {/* Define the size of Box */}
        <Topbar/>
        <Box m="5px" ml="-150px" mt="5px" px="100px" style={{ paddingRight: 50 }}>          <Header title="CREATE USER" subtitle="Create a New User Profile" />

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <Form>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  sx={{ gridColumn: "span 2" }}
                />
                 <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.surname}
                name="surname"
                error={!!touched.surname && !!errors.surname}
              //  helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
              //  helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
              //  helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
               // helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={!!touched.phone && !!errors.phone}
               // helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              
                <Select
                  fullWidth
                  variant="filled"
                  label="Building"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.buildingID || ''}
                  name="buildingID"
                  error={!!touched.buildingID && !!errors.buildingID}
                  sx={{ gridColumn: "span 4" }}
                >
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                >
                  Create New Manager
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
        </Box>
      </Grid>
    </Grid>
  );
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  // Add validation schema for other fields
});

const initialValues = {
  name: "",
  surname: "",
  username:"",
  password:"",
  phone: "",
  email: "",

  // Initialize other fields here
};

export default FormManagers;
