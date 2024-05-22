import React, { useState, useEffect } from "react";
import { Box, Button, Grid, Modal, TextField, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import Carousel from 'react-material-ui-carousel';
import Sidebar from "../global/Sidebar";
import Topbar from "../global/Topbar";

const validationSchema = yup.object({
  details: yup.string().required("Details are required"),
  availability: yup.boolean().required("Availability is required"),
  price: yup.number().required("Price is required"),
  pictures: yup.array().of(yup.string()),
});



const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [enableDelete, setEnableDelete] = useState(false); // State to enable image deletion

  useEffect(() => {
    fetch("http://localhost:8080/api/room")
      .then(response => response.json())
      .then(data => setRooms(data))
      .catch(error => {
        console.error("There was an error fetching the room data!", error);
      });
  }, []);

  const fetchRooms = () => {
    fetch("http://localhost:8080/api/room")
      .then(response => response.json())
      .then(data => setRooms(data))
      .catch(error => {
        console.error("There was an error fetching the room data!", error);
      });
  };
  
  const handleEditClick = (roomId) => {
    fetch(`http://localhost:8080/api/room/${roomId}`)
      .then(response => response.json())
      .then(data => {
        setSelectedRoom(data);
        setModalOpen(true);
      })
      .catch(error => {
        console.error("There was an error fetching the room details!", error);
      });
  };

  const handleImageUpload = (roomId, files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
  
    fetch(`http://localhost:8080/api/room/${roomId}/upload`, {
      method: "POST",
      body: formData,
    })
    .then(response => {
      if (response.ok) {
        console.log("Image uploaded successfully");
        // Fetch the updated room data after uploading images
        fetch(`http://localhost:8080/api/room/${roomId}`)
          .then(response => response.json())
          .then(data => {
            // Update the selected room state with the new list of pictures
            setSelectedRoom(data);
            // Close the modal if needed
            setModalOpen(true);

            fetchRooms();
          })
          .catch(error => {
            console.error("There was an error fetching the updated room details!", error);
          });
      } else {
        console.error("There was an error uploading the image!");
      }
    })
    .catch(error => {
      console.error("There was an error uploading the image!", error);
    });
  };

  const handleEnableDelete = () => {
    setEnableDelete(true); // Enable image deletion
  };

  const handleImageDelete = () => {
    if (selectedRoom && selectedRoom.pictures && selectedImageIndex !== null) {
      const pictureIdToDelete = selectedRoom.pictures[selectedImageIndex];
      
      fetch(`http://localhost:8080/api/room/${selectedRoom.id}/pictures/${pictureIdToDelete}`, {
        method: "DELETE",
      })
      .then(response => {
        if (response.ok) {
          console.log("Image deleted successfully");
          
          // Fetch the updated room data after deleting image
          fetch(`http://localhost:8080/api/room/${selectedRoom.id}`)
            .then(response => response.json())
            .then(data => {

                setSelectedRoom(data);

              setDeleteModalOpen(false);

              fetchRooms();
            })
            .catch(error => {
              console.error("There was an error fetching the updated room details!", error);
            });
        } else {
          console.error("There was an error deleting the image!");
        }
      })
      .catch(error => {
        console.error("There was an error deleting the image!", error);
      });
    } else {
      console.error("Selected room or image index is null");
    }
  };

  const handleSubmit = (values) => {
    fetch(`http://localhost:8080/api/room/${selectedRoom.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
    .then(response => {
      if (response.ok) {
        console.log("Room updated successfully");
        setModalOpen(false);
        fetch("http://localhost:8080/api/room")
          .then(response => response.json())
          .then(data => setRooms(data));
      } else {
        console.error("There was an error updating the room!");
      }
    })
    .catch(error => {
      console.error("There was an error updating the room!", error);
    });
  };

  return (
    <Grid container>
      <Grid item xs={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8}>
        <Topbar />
        <Box p={3}>
          <Typography variant="h4" gutterBottom>
            Rooms
          </Typography>
          <Grid container spacing={2}>
            {rooms.map(room => (
              <Grid item xs={12} sm={6} md={4} key={room.id}>
                <Box borderRadius={2} p={2} bgcolor="#f0f0f0">
                  <Typography variant="h6">Room Details</Typography>
                  <div style={{ minHeight: "250px", marginBottom: "10px", borderRadius: "15px", overflow: "hidden" }}>
                    {room.pictures && room.pictures.length > 0 ? (
                      <Carousel>
                        {room.pictures.map((pic, index) => (
                          <div key={index} style={{ position: "relative" }}>
                            <img
                              src={`http://localhost:8080/api/room/pictures?path=${pic}`}
                              alt={`Room ${index + 1}`}
                              style={{ width: "100%", height: "100%", borderRadius: "15px", objectFit: "cover", cursor: enableDelete ? "pointer" : "default" }}
                              onClick={() => {
                                if (enableDelete) {
                                  setSelectedImageIndex(index);
                                  setDeleteModalOpen(true);
                                }
                              }}
                            />
                          </div>
                        ))}
                      </Carousel>
                    ) : (
                      <Typography>No pictures available</Typography>
                    )}
                  </div>
                  <Typography>Details: {room.details}</Typography>
                  <Typography>Price: ${room.price}</Typography>
                  <Button style={{ color: "white", backgroundColor: "grey" }} onClick={() => handleEditClick(room.id)}>Edit</Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>

      {selectedRoom && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box p={4} bgcolor="#f0f0f0" borderRadius={2} m="auto" mt={5} style={{ width: "50%", color: "black" }}>
            <Formik
              initialValues={{
                details: selectedRoom.details || "",
                availability: selectedRoom.availability || false,
                price: selectedRoom.price || 0,
                pictures: selectedRoom.pictures || [],
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ setFieldValue }) => (
                <Form>
                  <Typography variant="h6">Edit Room</Typography>
                  <Field as={TextField} name="details" label="Details" fullWidth margin="normal" />
                  <FormControlLabel
                    control={<Field as={Checkbox} name="availability" />}
                    label="Availability"
                  />
                  <Field as={TextField} name="price" label="Price" fullWidth margin="normal" />
                <Box mt={2}>
                    <Typography>
                        Pictures
                        {selectedRoom.pictures.length > 0 && (
                        <Button style={{ marginLeft: "10px" }} onClick={handleEnableDelete} variant="outlined">Enable Delete</Button>
                        )}
                    </Typography>
                    <Box display="flex" flexWrap="wrap">
                        {selectedRoom.pictures && selectedRoom.pictures.map((pic, index) => (
                        <div key={index} style={{ position: "relative", marginRight: "10px", marginBottom: "10px" }}>
                            <img
                            src={`http://localhost:8080/api/room/pictures?path=${pic}`}
                            alt={`Room ${index + 1}`}
                            style={{ width: "100px", height: "100px", borderRadius: "15px", objectFit: "cover", cursor: enableDelete ? "pointer" : "default" }}
                            onClick={() => {
                                if (enableDelete) {
                                setSelectedImageIndex(index);
                                setDeleteModalOpen(true);
                                }
                            }}
                            />
                        </div>
                        ))}
                    </Box>
                    <Button variant="outlined" component="label">
                        Add Image
                        <input
                        type="file"
                        hidden
                        multiple
                        onChange={(event) => {
                            const files = event.target.files;
                            handleImageUpload(selectedRoom.id, files);
                            setFieldValue("pictures", [...files].map(file => file.name)); // Update the pictures field
                        }}
                        />
                    </Button>
                </Box>

                  <Box mt={2}>
                    <Button type="submit" variant="contained">Save</Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>
      )}

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box p={4} bgcolor="#f0f0f0" borderRadius={2} m="auto" mt={5} style={{ width: "50%", color: "black" }}>
          <Typography variant="h6">Are you sure you want to delete this image?</Typography>
          <Box mt={2}>
            <Button onClick={handleImageDelete} variant="contained" style={{ marginRight: "10px" }}>Yes</Button>
            <Button onClick={() => setDeleteModalOpen(false)} variant="outlined">No</Button>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Rooms;
