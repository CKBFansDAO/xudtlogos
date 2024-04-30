import React from 'react';
import { Route, Routes } from 'react-router-dom'
import Home from '../../pages/Home';
import Project from '../../pages/Project';

const MainView = () => {
    return (
        <div className='w-full flex justify-center pt-[60px]'>
            <Routes>
                <Route path='/' exact element={<Home />} />
                <Route path='/:xudt' element={<Project />} />
                <Route path='*' exact element={<Home />} />
            </Routes>
        </div>
    );
}

export default MainView;
