import React, { useEffect, useState, useRef } from 'react'
import Header from '../components/Header'
import GestionProductos from '../components/productos/GestionProductos'

function GestionProductosPagina() {
  // Para la altura dinámica del header
  const [headerHeight, setHeaderHeight] = useState(0)
  const headerRef = useRef()

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight)
    }
  }, [])

  return (
    <>
      <Header ref={headerRef} />
      <main style={{ paddingTop: headerHeight }}>
        <GestionProductos />
      </main>
    </>
  )
}

export default GestionProductosPagina
