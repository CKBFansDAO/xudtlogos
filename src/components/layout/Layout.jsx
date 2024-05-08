import React from 'react';
import MainView from './MainView';
import TopNav from './TopNav';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <TopNav />
            <div className="flex justify-center grow w-full bg-[#] text-[#] min-w-full">
                <MainView />
                {/*<MaintenancePage></MaintenancePage>*/}
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Layout;
