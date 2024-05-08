import React from 'react';

import xudts from '../assets/xudts.json'
import { Link } from 'react-router-dom';


const Home = () => {

    const renderXudtLogs = () => {
        return <div className='flex flex-wrap gap-5'>
            {Object.entries(xudts).map(([key, value]) => (
                <Link to={`/${key}`} key={key} className='w-32 h-32 p-2 flex flex-col gap-2 items-center hover:scale-110 hover:text-color-main'>
                    <img src={`/logos/thumbs/${key}.png`} className='h-10 w-10 rounded-full' alt={`xudt-${key}-logo-thumb`} />
                    <span className='text-[12px] w-full text-center'>{value.name} ({value.symbol}) logo</span>
                </Link>
            ))}
        </div>
    }

    return (
        <div className='flex flex-col py-10 gap-10'>
            <div className='flex flex-col gap-2 justify-center items-center'>
                <span className='title text-3xl'>High Quality xUDT Logos</span>
                <span className='text-xl'>Download transparent .PNG and vector .SVG logo files</span>
            </div>
            {renderXudtLogs()}
        </div>
    );
}

export default Home;
