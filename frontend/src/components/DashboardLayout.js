import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import NavbarLogin from "./NavbarLogin";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginInlineStart: isSidebarOpen ? "240px" : "0",
          transition: "margin-inline-start 0.3s ease",
        }}
      >
        <NavbarLogin />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
