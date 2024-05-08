import React from 'react';

import xudts from '../assets/xudts.json'
import { Link } from 'react-router-dom';


const Home = () => {

    const renderXudtLogs = () => {
        return <div className='flex flex-wrap gap-5'>
            {Object.entries(xudts).map(([key, value]) => (
                <Link to={`/${key}`} key={key} className='w-32 h-32 p-2 flex flex-col gap-2 items-center hover:scale-110 text-color-maintext hover:text-color-second'>
                    <img src={`/logos/thumbs/${key}.png`} className='h-10 w-10 rounded-full' alt={`xudt-${key}-logo-thumb`} />
                    <span className='w-full text-center leading-[1rem]'>{value.name} ({value.symbol}) logo</span>
                </Link>
            ))}
        </div>
    }

    return (
        <div className='flex flex-col py-14 gap-10'>
            <div className='flex flex-col gap-2 justify-center items-center'>
                <span className='title text-xl text-color-main'>High Quality xUDT Logos</span>
                <span className='text-sm text-color-maintext title'>Download transparent .PNG and vector .SVG logo files</span>
            </div>
            {renderXudtLogs()}
        </div>
    );
}

export default Home;
