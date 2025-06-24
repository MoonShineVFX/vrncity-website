import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Passport from "./pages/Passport";
import Preview from "./pages/Preview";
function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/passport" element={<Passport />} />
      <Route path="/preview" element={<Preview />} />
    </Routes>
  );
}

export default App;
