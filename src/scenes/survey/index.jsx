import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Modal } from "@mui/material";
import Header from "../../components/Header";
import Sidebar from "../global/Sidebar";
import Topbar from "../global/Topbar";
import { useParams } from "react-router-dom";

const Survey = () => {
  const { formId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [editedQuestion, setEditedQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(null); 
  const [isEditing, setIsEditing] = useState(Array(questions.length).fill(false));

  const [questionType, setQuestionType] = useState("TEXT");
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false); 

  const [confirmDelete, setConfirmDelete] = useState(false); // for confirmation modal



  const fetchEvaluationForm = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/performance/${formId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch evaluation form");
      }
      const data = await response.json();
      console.log("tek fetchi");
      setQuestions(data.questions);
      console.log(editedQuestion);
    } catch (error) {
      console.error("Error fetching evaluation form:", error);
    }
  };

  const editQuestion = async (questionIndex, editedQuestion) => {
    
    try {
      const questionToUpdate = {
        text: editedQuestion.text,
        type: editedQuestion.type,
        options: editedQuestion.options
      };
  
      const response = await fetch(`http://localhost:8080/api/performance/question/${formId}/${questionIndex}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(questionToUpdate)
      });
    

      const responseBody = await response.json();
    console.log(responseBody);

      console.log("pas editimit direkt");
      //console.log(response);

      if (!response.ok) {
        throw new Error("Failed to edit question");
      }
      // console.log(editedText);
      // const updatedQuestions = [...questions];
      // updatedQuestions[questionIndex].text = editedText.text;
      // setQuestions(updatedQuestions);

      fetchEvaluationForm();
    } catch (error) {
      console.error("Error editing question:", error);
    }
  };

  const addQuestion = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/performance/${formId}/question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: newQuestion, type: questionType, options: options })
      });
      if (!response.ok) {
        throw new Error("Failed to add question");
      }
      fetchEvaluationForm();
      setOpen(false);
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const deleteQuestion = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/performance/${formId}/delete/${questionIndex}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Failed to delete question");
      }
      fetchEvaluationForm();
      setConfirmDelete(false);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  useEffect(() => {
    if (formId) {
      fetchEvaluationForm();
    }
  }, [formId]);



  const handleEdit = (index) => {
    setQuestionIndex(index);
    setEditedQuestion(questions[index].text);
    console.log("JISJOI");
    console.log(index);
    console.log(questions[index].text);
    setIsEditing(prevState => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
  };
  


  const handleSave = async (index) => {
    const updatedQuestions = [...questions]; 
    updatedQuestions[index].text = editedQuestion; 
    setQuestions(updatedQuestions);
    
    const questionIndex = index;
    const questionType = updatedQuestions[index].type;
    const questionOptions = updatedQuestions[index].options; 
    
    const updatedQuestion = { 
      text: editedQuestion, 
      type: questionType, 
      options: questionOptions 
    };
    
    await editQuestion(questionIndex, updatedQuestion); 
  
    setIsEditing((prevState) => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };
  
  

  const handleDeleteConfirmation = (index) => {
    setQuestionIndex(index);
    setConfirmDelete(true);
  };
  
  const handleCancel = (index) => {
    setIsEditing(prevState => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };

  // return (
  //   <Grid container>
  //     <Grid item xs={3}>
  //       <Sidebar />
  //     </Grid>
  //     <Grid item xs={8}>
  //       <Topbar />
  //       <Box>
  //         <Header title="Performance Evaluation" subtitle="Questions" />
  //         {questions.map((text, index) => (
  //           <Box key={index} border={1} p={2} mb={2}>
  //             {isEditing[index] ? (
  //               <textarea
  //                 value={editedQuestion}
  //                 onChange={(e) => setEditedQuestion(e.target.value)}
  //                 style={{ width: "100%", minHeight: "15px" }}
  //               />
  //             ) : (
  //               <p>{text.text}</p>
  //             )}
  //             <p>Type: {text.type}</p>
  //             {text.options && (
  //               <ul>
  //                 {text.options.map((option, optionIndex) => (
  //                   <li key={optionIndex}>{option}</li>
  //                 ))}
  //               </ul>
  //             )}
  //             {isEditing[index] ? (
  //               <>
  //                 <Button variant="contained" color="primary" onClick={() => handleSave(index)}>Save</Button>
  //                 <Button variant="contained" onClick={() => handleCancel(index)}>Cancel</Button>
  //               </>
  //             ) : (
  //               <>
  //                 <Button variant="contained" onClick={() => handleEdit(index)}>Edit</Button>
  //                 <Button variant="contained" onClick={() => deleteQuestion(index)}>Delete</Button>
  //               </>
  //             )}
  //           </Box>
  //         ))}
  //         <input
  //           type="text"
  //           value={newQuestion}
  //           onChange={(e) => setNewQuestion(e.target.value)}
  //         />
  //         <Button variant="contained" color="primary" onClick={addQuestion}>Add Question</Button>
  //       </Box>
  //     </Grid>
  //   </Grid>
  // );


  // return (
  //   <Grid container>
  //     <Grid item xs={3}>
  //       <Sidebar />
  //     </Grid>
  //     <Grid item xs={8}>
  //       <Topbar />
  //       <Box>
  //         <Header title="Performance Evaluation" subtitle="Questions" />
  //         <div style={{ maxHeight: "400px", overflow: "auto" , marginBottom: "50px" }}>
  //           {questions.map((text, index) => (
  //             <Box key={index} border={1} p={2} mb={2}>
                // {isEditing[index] ? (
                //   <textarea
                //     value={editedQuestion}
                //     onChange={(e) => setEditedQuestion(e.target.value)}
                //     style={{ width: "100%", minHeight: "15px" }}
                //   />
                // ) : (
                //   <p>{text.text}</p>
                // )}
                // <p>Type: {text.type}</p>
                // {text.options && (
                //   <ul>
                //     {text.options.map((option, optionIndex) => (
                //       <li key={optionIndex}>{option}</li>
                //     ))}
                //   </ul>
                // )}
                // {isEditing[index] ? (
                //   <>
                //     <Button variant="contained" color="primary" onClick={() => handleSave(index)}>Save</Button>
                //     <Button variant="contained" onClick={() => handleCancel(index)}>Cancel</Button>
                //   </>
                // ) : (
                //   <>
                //     <Button variant="contained" onClick={() => handleEdit(index)}>Edit</Button>
                //     <Button variant="contained" onClick={() => deleteQuestion(index)}>Delete</Button>
                //   </>
                // )}
  //             </Box>
  //           ))}
  //         </div>
  //         <input
  //           type="text"
  //           value={newQuestion}
  //           onChange={(e) => setNewQuestion(e.target.value)}
  //           style={{ marginBottom: "70px" }}
  //         />
  //         <Button variant="contained" color="primary" onClick={addQuestion}>Add Question</Button>
  //       </Box>
  //     </Grid>
  //   </Grid>
  // );


  return (
    <Grid container>
      <Grid item xs={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8}>
        <Topbar />
        <Box>
          <Header title="Performance Evaluation" subtitle="Questions" />
          <div style={{ maxHeight: "400px", overflow: "auto", marginBottom: "50px" }}>
            {questions.map((text, index) => (
              <Box key={index} border={1} p={2} mb={2}>
                 {isEditing[index] ? (
                  <textarea
                    value={editedQuestion}
                    onChange={(e) => setEditedQuestion(e.target.value)}
                    style={{ width: "100%", minHeight: "15px" }}
                  />
                ) : (
                  <p>{text.text}</p>
                )}
                <p>Type: {text.type}</p>
                {text.options && (
                  <ul>
                    {text.options.map((option, optionIndex) => (
                      <li key={optionIndex}>{option}</li>
                    ))}
                  </ul>
                )}
                {isEditing[index] ? (
                  <>
                    <Button variant="contained" color="primary" onClick={() => handleSave(index)}>Save</Button>
                    <Button variant="contained" onClick={() => handleCancel(index)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button variant="contained" onClick={() => handleEdit(index)}>Edit</Button>
                    <Button variant="contained" onClick={() => handleDeleteConfirmation(index)}>Delete</Button>
                  </>
                )}
              </Box>
            ))}
          </div>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Add Question</Button>


          {/* modal for adding new question */}
          <Modal open={open} onClose={() => setOpen(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                width: 400,
              }}
            >
              <h2>Add New Question</h2>
              <input
                type="text"
                placeholder="Enter question text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                style={{ marginBottom: "20px" }}
              />
              <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} style={{ marginBottom: "20px" }}>
                <option value="TEXT">Text</option>
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="DROPDOWN">Dropdown</option>
                <option value="RATING_SCALE">Rating Scale</option>
              </select>
              {questionType === "MULTIPLE_CHOICE" || questionType === "DROPDOWN" ? (
                <div>
                  <input
                    type="text"
                    placeholder="Enter option"
                    value={options}
                    onChange={(e) => setOptions(e.target.value)}
                    style={{ marginBottom: "20px" }}
                  />
                  <Button variant="contained" onClick={() => setOptions([...options, ""])}>Add Option</Button>
                </div>
              ) : null}
              <Button variant="contained" color="primary" onClick={addQuestion}>Save</Button>
              <Button variant="contained" onClick={() => setOpen(false)}>Close</Button>
            </Box>
          </Modal>


          {/* modal for delete */}
          <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                width: 400,
              }}
            >
              <p>Are you sure you want to delete this question?</p>
              <Button variant="contained" color="primary" onClick={deleteQuestion}>Yes</Button>
              <Button variant="contained" onClick={() => setConfirmDelete(false)}>No</Button>
            </Box>
          </Modal>

        </Box>
      </Grid>
    </Grid>
  );


  
};

export default Survey;
 