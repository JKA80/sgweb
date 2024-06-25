import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/loginUser';
import AddUser from './components/addUser';
import Dashboard from './components/dashboard';
import AddUserInfo from './components/addUserInfo';
import ChooseTarget from './components/chooseTarget';
// määritellään eri routet, toistaiseksi ei muuta.
const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/adduser" element={<AddUser />} />
                    <Route path="/adduserinfo" element={<AddUserInfo />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/choosetarget" element={<ChooseTarget />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;