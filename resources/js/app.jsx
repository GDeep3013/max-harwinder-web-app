
// import { Provider } from 'react-redux';
// import { store } from '../store/Store';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/index.css';
import '../css/custom.css';
import '../css/admin.css';
import '../css/responsive.css';
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import '../css/app.css';
import AppRouter from "./components/routes/AppRouter";


export default function App() {
    return (<AppRouter />);
}

if (document.getElementById("root")) {
    createRoot(document.getElementById("root")).render(
        <Router>
            {/* <Test/> */}
            <App />
        </Router>
    );
}