import App from "./App";
import { Routes, Route } from "react-router-dom";


function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  );
}

export default Rutas;
