import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardMedia } from "@mui/material";
import { useParams } from "react-router-dom";
import SidebarStudent from "../global/SidebarStudent";
import Topbar from "../global/Topbar";
import Carousel from 'react-material-ui-carousel';

const StudentRoom = ({ userName, userSurname }) => {
  const { studentId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [roomImages, setRoomImages] = useState([]);

  useEffect(() => {
    // Fetch room details when the component mounts
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/room/details/${studentId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch room details");
        }
        const data = await response.json();
        setRoomDetails(data);
        setRoomImages(data.pictures || []);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    fetchRoomDetails();
  }, [studentId]);

  return (
    <Grid container>
      <Grid item xs={3}>
        <SidebarStudent userName={userName} userSurname={userSurname} />
      </Grid>
      <Grid item xs={9}>
        <Topbar />
        <Grid container spacing={2}>
          <Grid item xs={6} style={{marginTop: "70px"}}>
            {roomImages.length > 0 && (
              <Box mt={2} >
                <Typography variant="h5">Room Images</Typography>
                <div style={{marginTop: "20px"}}>
                  <Carousel>
                    {roomImages.map((imageUrl, index) => (
                      <div key={index} >
                        <img
                          src={`http://localhost:8080/api/room/pictures?path=${encodeURIComponent(imageUrl)}`}
                          alt={`Room Image ${index + 1}`}
                          style={{ width: "80%", height: "80%", borderRadius: "15px", objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              </Box>
            )}
          </Grid>
          <Grid item xs={6}>
            {roomDetails && (
              <Box mt={2}>
                <Typography variant="h5">Room Details</Typography>
                <Typography variant="body1">{roomDetails.details}</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StudentRoom;
