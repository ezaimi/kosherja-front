import { useState, useEffect } from "react";
import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import Sidebar from "../global/Sidebar";
import Topbar from "../global/Topbar";
import Carousel from 'react-material-ui-carousel';


const Buildings = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [buildings, setBuildings] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);

  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);


  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/building/count");
        if (!response.ok) {
          throw new Error("Failed to fetch buildings");
        }
        const data = await response.json();
        setBuildings(data);
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };
//
    fetchBuildings();
  }, []);

  const initialValues = {
    name: "",
    occupancyStatus: "",
    noOfRooms: ""
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Building name is required"),
    occupancyStatus: yup.number().required("Occupancy status is required"),
    noOfRooms: yup.number().required("Number of rooms is required")
  });

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("http://localhost:8080/api/building/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error("Failed to create building");
      }

      const data = await response.json();
      setBuildings([...buildings, data]);
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating building:", error);
    }
    setSubmitting(false);
  };



  const handleDeleteClick = (buildingId) => {
    setSelectedBuildingId(buildingId);
    setConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/building/${selectedBuildingId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete building");
      }

      setBuildings(buildings.filter(building => building.id !== selectedBuildingId));
      setSelectedBuildingId(null);
      setConfirmDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting building:", error);
    }
  };

  const handleCancelDelete = () => {
    setSelectedBuildingId(null);
    setConfirmDeleteModalOpen(false);
  };

  return (
    <Grid container>
      <Grid item xs={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8}>
        <Topbar />
        <Box>
          <Header title="BUILDINGS" subtitle="List of Buildings" />
          <Button variant="contained" onClick={handleModalOpen}>Add New Building</Button>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
            {buildings.map((building, index) => (
              <Box key={index} bgcolor="#00C0AE" color="primary.contrastText" p={2} mt={2} flexBasis="30%">
                <p>Building Name: {building.name}</p>
                <p>Occupied Rooms: {building.occupancyStatus}</p>
                <p>Total Number of Rooms: {building.noOfRooms}</p>
                <Button onClick={() => handleDeleteClick(building.id)}>Delete</Button>
              </Box>
            ))}
          </div>
        </Box>
      </Grid>
      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field name="name" as={TextField} label="Building Name" fullWidth margin="normal" />
                <Field name="occupancyStatus" as={TextField} type="number" label="Occupancy Status" fullWidth margin="normal" />
                <Field name="noOfRooms" as={TextField} type="number" label="Number of Rooms" fullWidth margin="normal" />
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>Add</Button>
                <Button onClick={handleModalClose} variant="contained">Close</Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      <Modal open={confirmDeleteModalOpen} onClose={handleCancelDelete}>
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Typography variant="h6">Are you sure you want to delete this building?</Typography>
          <Button onClick={handleConfirmDelete} variant="contained" color="primary">Yes</Button>
          <Button onClick={handleCancelDelete} variant="contained">No</Button>
        </Box>
      </Modal>
    
    </Grid>
  );
};

export default Buildings;
