import Contact from "./contact";
import GifLogin from "./GifLogin";
import ClickTrapQuiz from "./ClickTrapQuiz";
import Spawn from "./Spawn"; 
import Profile from "./Profile";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Spawn />}/> 
        <Route path="/login" element={<GifLogin />}/> 
        <Route path="/quiz-click-trap" element={<ClickTrapQuiz />}/> 
        <Route path="/contact" element={<Contact />}/> 
        <Route path="/Profile" element={<Profile />}/> 
      </Routes>
    </BrowserRouter>
  )
}
