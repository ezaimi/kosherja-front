import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Modal, Typography, TextField, Select, MenuItem } from "@mui/material"; // Import necessary components
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import Sidebar from "../global/Sidebar";
import Topbar from "../global/Topbar";

const Managers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [managers, setManagers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updatedManagerData, setUpdatedManagerData] = useState({});

  const [buildings, setBuildings] = useState([]);
  

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

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/coordinators/list");
        if (!response.ok) {
          throw new Error("Failed to fetch managers");
        }
        const data = await response.json();
        // Add unique id to each manager
        const managersWithIds = data.map((manager, index) => ({ ...manager, id: index + 1 }));
        setManagers(managersWithIds);
      } catch (error) {
        setError("Error fetching managers. Please try again.");
      }
    };
    fetchManagers();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "surname", headerName: "Surname", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "buildingName", headerName: "Building", flex: 1 },
    { field: "numberOfStudents", headerName: "Number of Students", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button style={{ color: 'white' }} onClick={() => handleEdit(params.row)}>Edit</Button>
          <Button style={{ color: 'white' }} onClick={() => handleDelete(params.row)}>Delete</Button>
        </Box>
      ),
    },
  ];

  const rows = managers.map((managerData) => ({
    id: managerData.manager.id,
    name: managerData.manager.name,
    surname: managerData.manager.surname,
    email: managerData.manager.email,
    phone: managerData.manager.phone,
    buildingName: managerData.building ? managerData.building.name : "",
    numberOfStudents: managerData.numberOfStudents,
  }));

  const handleEdit = (manager) => {
    setSelectedManager(manager);
    setUpdatedManagerData({ ...manager }); // Initialize updated manager data
    setEditModalOpen(true);
  };

  const handleDelete = (manager) => {
    setSelectedManager(manager);
    setDeleteModalOpen(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      // --------- API request to update manager
      const response = await fetch(`http://localhost:8080/api/manager/update/${selectedManager.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedManagerData),
      });
      if (!response.ok) {
        throw new Error('Failed to update manager');
      }
      // Close edit modal after successful update
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating manager:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      // -- API request to delete manager
      const response = await fetch(`http://localhost:8080/api/manager/delete/${selectedManager.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete manager');
      }

      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting manager:', error);
    }
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
  };

  return (
    <Grid container>
      <Grid item xs={3}>
      <Sidebar />
      </Grid>
      <Grid item xs={9}>
        <Topbar />
        <Box m="5px" ml="-150px" mt="5px" px="100px" style={{ paddingRight: 50 }}>
          <Header title="MANAGERS" subtitle="List of Managers" />
          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${colors.grey[100]} !important`,
              },
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              getRowId={(row) => row.id}
            />
          </Box>
        </Box>
      </Grid>

      <Modal open={editModalOpen} onClose={handleModalClose}>
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
          <Typography variant="h6">Edit Manager</Typography>
          <form onSubmit={handleEditSave}>
            <TextField
              margin="normal"
              fullWidth
              label="Name"
              value={updatedManagerData.name || ''}
              onChange={(e) => setUpdatedManagerData({ ...updatedManagerData, name: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Surname"
              value={updatedManagerData.surname || ''}
              onChange={(e) => setUpdatedManagerData({ ...updatedManagerData, surname: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Username"
              value={updatedManagerData.username || ''}
              onChange={(e) => setUpdatedManagerData({ ...updatedManagerData, username: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Passowrd"
              value={updatedManagerData.password || ''}
              onChange={(e) => setUpdatedManagerData({ ...updatedManagerData, password: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              value={updatedManagerData.email || ''}
              onChange={(e) => setUpdatedManagerData({ ...updatedManagerData, email: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Phone"
              value={updatedManagerData.phone || ''}
              onChange={(e) => setUpdatedManagerData({ ...updatedManagerData, phone: e.target.value })}
            />
             <Select
                  margin="normal"
                  fullWidth
                  label="Building"
                  value={updatedManagerData.buildingID || ''}
                  onChange={(e) => setUpdatedManagerData({ ...updatedManagerData, buildingID: e.target.value })}
                >
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name}
                    </MenuItem>
                  ))}
                </Select>

              {/* <TextField
              margin="normal"
              fullWidth
              label="No of Students"
              value={updatedManagerData.numberOfStudents || ''}
              onChange={(e) => setUpdatedManagerData({ ...updatedManagerData, numberOfStudents: e.target.value })}
            /> */}

            <Button type="submit" style={{ color: 'white' }}>Save</Button>
            <Button onClick={handleModalClose} style={{ color: 'white' }}>Cancel</Button>
          </form>
        </Box>
      </Modal>
      <Modal open={deleteModalOpen} onClose={handleModalClose}>
        <Box sx={{
            position: 'absolute',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
          <Typography variant="h6">{`Are you sure you want to delete ${selectedManager ? selectedManager.name : "this manager"}?`}</Typography>
          <Button onClick={handleDeleteConfirm}  style={{ color: 'white' }}>Yes</Button>
          <Button onClick={handleModalClose}  style={{ color: 'white' }}>No</Button>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Managers;
