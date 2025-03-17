import { useState } from "react";
import './App.css'
import FormVendedorLogin from './components/Form/FormVendedorLogin';
import FormVendedorRegister from './components/Form/FormVendedorRegister';
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
