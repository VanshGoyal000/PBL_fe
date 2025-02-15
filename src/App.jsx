import React from 'react';
import Batamiz from './components/Batamiz';

function App(){
  return (
    <Batamiz/>
  )
}
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/Login.jsx';
// import Register from './components/Register.jsx';
// import Groups from './components/Groups.jsx';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = React.useState(
//     !!localStorage.getItem('token')
//   );

//   return (
//     <Router>
//       <div className="container mx-auto px-4 py-8">
//         <Routes>
//           <Route 
//             path="/login" 
//             element={
//               <Login 
//                 setIsAuthenticated={setIsAuthenticated} 
//               />
//             } 
//           />
//           <Route path="/register" element={<Register />} />
//           <Route 
//             path="/" 
//             element={
//               isAuthenticated ? 
//                 <Groups /> : 
//                 <Navigate to="/login" />
//             } 
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

export default App;
