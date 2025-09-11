import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './pages/Login'
import Landing from './pages/Landing';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ImageCarousel from './components/ImageCarousel';
import Blogcard from './components/Blogcard';
import useAlertStore from './store/alertStore';
import CustomAlert from './components/CustomAlert';


function App() {
  const { message, showAlert, hideAlert } = useAlertStore();

  
  return (
    <>
    {message && (
        <CustomAlert
          message="This Featue will be added soon!!"
          type="info"
          onClose={() => hideAlert()}
        />
      )}
    <Landing />
    </>
  )
}

export default App
