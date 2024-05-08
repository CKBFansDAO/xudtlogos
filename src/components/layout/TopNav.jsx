import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as AppLogo } from '../../assets/images/xudtlogos-logo.svg';

let navs_config = [
    {
        name: "FAQ",
        icon: "",
        link: "/faq"
    },
    {
        name: "About",
        icon: "",
        link: "/about"
    }
]

const TopNav = () => {
    const location = useLocation();

    const matches = location.pathname.match(/\/\w+/g);
    const paths = matches?.map(match => match.toLowerCase()) || ['/'];

    const [curMainTab, setCurMainTab] = useState(paths[0]);

    const renderNavs = () => {

        return <div className='flex items-center md:gap-8 '>
            {
                navs_config.map((item, index) => {
                    return <Link key={`nav-${index}`} onClick={() => setCurMainTab(item.link)}
                        className={`flex flex-col h-[60px] cursor-pointer hover:text-color-maintext border-color-main ${curMainTab === item.link ? 'border-b-[2px] border-color-maintext text-color-maintext' : 'text-[#FFF]'} `} to={`${item.link}`}>
                        <div className='flex px-2 h-full items-center' key={`main_tab_${index}_${item.name}`}>
                            {item.name}
                        </div>

                    </Link>
                })
            }
        </div>
    }

    const renderNavBar = () => {
        return <div className='flex gap-4 py-4 text-white w-full pr-5 px-5 md:px-10 items-center text-[14px] md:text-[16px]'>
            <Link to='/' className={`flex items-center h-[60px] px-2 cursor-pointer `}
            onClick={() => setCurMainTab('')}>
                <AppLogo></AppLogo>
            </Link>
            <div className='grow'></div>
            {renderNavs()}
        </div>
    }
    return (
        <div className='flex h-[60px] bg-color-main fixed top-0 w-full opacity-100 z-[9999] border-b border-color-main border-opacity-20'>
            {renderNavBar()}
        </div>
    );
}

export default TopNav;
