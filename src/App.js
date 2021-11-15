import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import NoteState from './context/notes/NoteState';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Signup from './components/Signup';
import Login from './components/Login';
function App() {
  return (
    <>
    <NoteState>
    <Router>
        <Navbar />
        <div className="container"> 

        <Routes>
          <Route path="/" element={<Home />}/>
          <Route exact path="/signup" element ={<Signup />}/>
          <Route exact path="/login" element ={<Login />}/>  
          <Route exact path="/about" element ={<About />}/>
        </Routes>
        </div>
    </Router>
    </NoteState>
    </>
  );
}

export default App;
