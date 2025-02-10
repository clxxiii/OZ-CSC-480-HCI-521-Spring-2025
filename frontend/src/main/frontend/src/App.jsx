import './App.css'
import ReactLogo from "./assets/react.svg"
import Counter from './components/Counter';

export default function App() {


  return (
    <div className="container">
      <h1 className="d-flex gap-2 align-items-center">
        <img src={ReactLogo} alt="" />
        <span>Starter Frontend App</span>
      </h1>
      <hr />

      <Counter />
    </div>
  )
}


