import { useState } from "react";
import './App.css'
import FormVendedorLogin from './components/vendedor/Form/FormVendedorLogin';
import FormVendedorRegister from './components/vendedor/Form/FormVendedorRegister';
import ComponenteRobo from "./components/common/ComponenteRobo";
function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
    <div className='flex flex-col items-center'>
    <FormVendedorLogin setIsOpen={setIsOpen}>
    </FormVendedorLogin>
    <FormVendedorRegister isOpen={isOpen} setIsOpen={setIsOpen}></FormVendedorRegister>
    </div>
    </>
  )
}

export default App
