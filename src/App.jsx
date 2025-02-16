import React, {useState} from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login';
import Signup from './components/Signup';
import Chat from './components/Chatpage';

function App() {
  const [user, setUser] = useState();
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/chat" element={user ? <Chat user={user} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? '/chat' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
