
import { useEffect, useState } from "react"
import { getCities, db } from "./firebase"
import Welcome from "./Welcome"
function App() { 
  const [nombre,setNombre] = useState()
  useEffect(()=>{
    getCities(db).then((data)=>{
      //data.map((data)=>{console.log("data:", data)})
      setNombre(data[0])
    })
    
  },[])
  
  return (
  <Welcome nombre = {nombre?.name}/> 
  )
}

export default App
