import React,{useState} from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import { Outlet } from "react-router-dom";
import ProfileModal from './components/ProfileModal';


function Mainlayout() {
  
    
  return (
    <>
        <Navbar/>
        <div className='flex  '>
          
           <Sidebar/>
            <Outlet/>
            
          <ProfileModal/>
        </div>
    </>
  )
}

export default Mainlayout
