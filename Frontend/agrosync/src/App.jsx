import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";
import SideBar from "./Components/Layouts/SideBar";
import Dashboard from "./Components/Layouts/Dashboard";
import InventoryPage from "./Pages/InventoryPage";
import LivestockPage from "./Pages/LivestockPage";
import CropRecommendationPage from "./Pages/CropRecommendationPage"
import TalkToData from "./Pages/TalkToData";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<SideBar />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="crops" element={<CropRecommendationPage />} />
          <Route path="livestock" element={<LivestockPage />} />
          <Route path="talktodata" element={<TalkToData />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
