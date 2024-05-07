import React from 'react';
import { Route, Routes } from 'react-router-dom'
import Home from '../../pages/Home';
import Project from '../../pages/Project';
import Faqs from '../../pages/Faqs';
import About from '../../pages/About';

const MainView = () => {
    return (
        <div className='w-full flex justify-center pt-[60px] px-5 md:px-10'>
            <Routes>
                <Route path='/' exact element={<Home />} />
                <Route path='/faq' exact element={<Faqs />} />
                <Route path='/about' exact element={<About />} />
                <Route path='/:xudt' element={<Project />} />
                <Route path='*' exact element={<Home />} />
            </Routes>
        </div>
    );
}

export default MainView;
