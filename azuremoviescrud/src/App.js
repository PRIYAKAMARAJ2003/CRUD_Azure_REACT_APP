import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Create from './pages/Create';
import Read from './pages/Read';
 
function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/read" element={<Read />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
 
export default App;