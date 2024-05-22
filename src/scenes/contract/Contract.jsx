import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid } from "@mui/material";
import { useState } from "react";
import Header from "../../components/Header";
import SidebarStudent from "../global/SidebarStudent";
import { useParams } from "react-router-dom"; // Import useParams here

const Contract = ({ userName, userSurname }) => {
  const { studentId } = useParams();
  const [open, setOpen] = useState(false);
  const [contract, setContract] = useState(null);

  const handleClickOpen = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/student/contract/${studentId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch contract details");
      }
      const data = await response.json();
      setContract(data);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching contract details:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container>
      <Grid item xs={3}>
        <SidebarStudent userName={userName} userSurname={userSurname} />
      </Grid>
      <Grid item xs={8} mt="40px">
        <Header title="Main Dashboard" subtitle="Student" />
        <Box display="flex">
          <Box
            mt="100px"
            ml="5px"
            mr="20px" // Add margin to create distance between the boxes
            style={{
              width: '400px',
              height: '200px', // Set height equal to width to make it a square
              cursor: 'pointer',
              backgroundColor: '#3f51b5',
              padding: '20px',
              textAlign: 'center',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              color: '#fff'
            }}
            onClick={handleClickOpen}
          >
            <Typography variant="h6">Contract</Typography>
          </Box>
          <Box
            mt="100px"
            ml="5px"
            style={{
              width: '400px',
              height: '200px', // Set height equal to width to make it a square
              cursor: 'pointer',
              backgroundColor: '#3f51b5',
              padding: '20px',
              textAlign: 'center',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              color: '#fff'
            }}
            onClick={handleClickOpen}
          >
            <Typography variant="h6">ID</Typography>
          </Box>
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Contract Details</DialogTitle>
          <DialogContent>
            {contract ? (
              <div>
                <Typography variant="body1"><strong>Terms:</strong> {contract.terms}</Typography>
                <Typography variant="body1"><strong>Duration:</strong> {contract.duration} months</Typography>
              </div>
            ) : (
              <Typography variant="body1">Loading...</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default Contract;
