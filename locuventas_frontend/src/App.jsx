import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import FormVendedorLogin from "./pages/FormVendedorLogin";
import Dashboard from "./pages/Dashboard";
import FormVendedorRegister from "./components/vendedor/Form/FormVendedorRegister";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex flex-col items-center ">
        <Routes>
          <Route
            path="/"
            element={<FormVendedorLogin setIsOpen={setIsOpen} />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <FormVendedorRegister isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </BrowserRouter>
  );
}

export default App;
