import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Category from "./components/Category";
import XLink from "./components/xLink"; 

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Category />} />
        <Route path="/xLink" element={<XLink />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
