import React, { useState } from "react";
import '../../styles/login.css';
import UpdatedLogin from "./login";

// function Auth({ onLoginSuccess }) {
//   const [error, setError] = useState(null);

//   const handleLoginSuccess = (role) => {
//     // Call the onLoginSuccess function with the role obtained from the login component
//     onLoginSuccess(role);
//   };

//   return (
//     <>
//       <div className="LoginBack">
//         {/* Pass the handleLoginSuccess function to the UpdatedLogin component */}
//         <UpdatedLogin onLoginSuccess={handleLoginSuccess} />
//         {error && <div className="error">{error}</div>}

//       </div>
//     </>
//   );
// }

// export default Auth;

function Auth({ onLoginSuccess }) {
  const [error, setError] = useState(null);

  const handleLoginSuccess = (response) => {
    // Call the onLoginSuccess function with the full response object
    
    onLoginSuccess(response);
  };

  return (
    <>
      <div className="LoginBack">
        {/* Pass the handleLoginSuccess function to the UpdatedLogin component */}
        <UpdatedLogin onLoginSuccess={handleLoginSuccess} />
        {error && <div className="error">{error}</div>}

      </div>
    </>
  );
}

export default Auth;
