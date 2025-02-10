import { useState } from "react"

export default function BoxInput() {

  const [count, setCount] = useState(0);



  return (
        <button onClick={() => setCount((n) => n+1)} className="btn btn-primary">This button has been pressed {count} times.</button>
  )
}