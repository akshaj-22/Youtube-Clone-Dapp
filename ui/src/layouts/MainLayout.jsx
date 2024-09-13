import React from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = () => {
    return (
        <>
        <Outlet/>
        <ToastContainer />
        </>
    )
}

export default MainLayout