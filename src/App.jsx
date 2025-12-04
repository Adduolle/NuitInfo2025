import Contact from "./contact";
import GifLogin from "./GifLogin";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GifLogin />}/> 
        <Route path="/contact" element={<Contact />}/> 
      </Routes>
    </BrowserRouter>
  )
}
