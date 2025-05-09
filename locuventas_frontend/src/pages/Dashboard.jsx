import React from 'react'
import { useEffect, useState, useRef } from 'react'
import Header from '../components/Header'
import Aside from '../components/Aside'
import Main from '../components/Main'

function Dashboard() {
  //Para la altura del aside y main 
const [headerHeight, setHeaderHeight] = useState(0);
const headerRef = useRef();

useEffect(() => {
  if (headerRef.current) {
    setHeaderHeight(headerRef.current.offsetHeight);
  }
}, []);
  return (
    <div>
      <Header ref={headerRef}></Header>
      <div className="flex flex-col md:flex-row min-h-screen mt-20" style={{ paddingTop: headerHeight }}>
      {/* Sidebar */}
      <aside className="md:w-1/4 w-full bg-gray-800 text-white">
        <Aside />
      </aside>

      {/* Main content */}
      <main className="md:w-3/4 w-full bg-white">
        <Main />
      </main>
    </div>
    </div>
    
  )
}

export default Dashboard