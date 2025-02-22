import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Homepage from "./Pages/Homepage";
import SelectRepo from "./Pages/SelectRepo";
import Dashboard from "./Pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/select-repo" element={<SelectRepo />} />
      <Route  path="/dashboard" element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
