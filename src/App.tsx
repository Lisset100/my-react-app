
import { useEffect, useState } from "react"
import { getCities, db } from "./firebase"
import Welcome from "./Welcome"

function App() { 
  const [nombres,setNombres] = useState([])
  useEffect(()=>{
    getCities(db).then((data)=>{
      //data.map((data)=>{console.log("data:", data)})
      setNombres(data)
    })
  },[])
  return (
    <>
      {nombres.map((nombre, index) => (
        <Welcome key={index} nombre={nombre.name}/>
      ))}
    </>
  )
}

export default App
