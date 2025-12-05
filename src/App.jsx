import Contact from "./contact";
import GifLogin from "./GifLogin";
import ClickTrapQuiz from "./ClickTrapQuiz";
import PCBuilderGame from "./pc_builder_game";
import Spawn from "./Spawn"; 
import ProfileTest from "./ProfileTest";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Spawn />}/> 
        <Route path="/login" element={<GifLogin />}/> 
        <Route path="/quiz-click-trap" element={<ClickTrapQuiz />}/> 
        <Route path="/pc-builder-game" element={<PCBuilderGame />}/> 
        <Route path="/contact" element={<Contact />}/> 
        <Route path="/ProfileTest" element={<ProfileTest />}/> 
      </Routes>
    </BrowserRouter>
  )
}
