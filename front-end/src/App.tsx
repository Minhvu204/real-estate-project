import Nav from "./components/Nav"
import RegisterPage from './pages/SearchPage/registerPage';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/SearchPage/HomePage';
function App() {

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  )
}

export default App
