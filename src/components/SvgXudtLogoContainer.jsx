import React from 'react';
import useXudtLogo from '../hooks/useXudtLogo';
import XudtLogoLoader from './XudtLogoLoader';

const SvgXudtLogoContainer = ({ symbol }) => {

    const { isLoading, loaded } = useXudtLogo({ symbol, logoType: 'svg' });
    
    const url = `/logos/${symbol}-logo.svg`;
    const fileName = `xudt-${symbol}-logo.svg`;

    if (isLoading) {
        return <div className='flex flex-col md:flex-row gap-5 md:gap-10 animate-pulse'>

            <div className='w-60 h-60 rounded-md border border-[#CCC] bg-[#aaa] flex items-center justify-center'>
                
            </div>

            <div className='flex flex-col gap-10 place-content-center'>
                <div className='flex flex-col'>
                    <span className='text-xl text-color-maintext'>Vector file</span>
                    <span className='text-color-maintext'> </span>
                </div>
                <div className='flex flex-col gap-5'>
                    <span className='font-bold text-base text-[#111]'>{fileName}</span>
                    <div className='font-bold text-center rounded py-2 bg-color-main text-white'>Download</div>
                </div>
            </div>
        </div>
    }

    if (!loaded) {
        return <></>
    }

    return (
        <div className='flex flex-col md:flex-row gap-5 md:gap-10'>

            <div className='w-60 h-60 rounded-md border border-[#aaa] flex items-center justify-center'>
                <XudtLogoLoader symbol={symbol} ></XudtLogoLoader>
            </div>

            <div className='flex flex-col gap-10 place-content-center'>
                <div className='flex flex-col'>
                    <span className='text-xl'>Vector file</span>
                    <span className='text-color-maintext h-[21px]'> </span>
                </div>
                <div className='flex flex-col gap-5'>
                    <a className='font-bold underline underline-offset-2 text-base text-[#111]' href={url} target="_blank" rel="noopener noreferrer">{fileName}</a>
                    <a className='font-bold text-center rounded py-2 bg-color-main text-white' href={url} target="_blank" rel="noopener noreferrer">Download</a>
                </div>
            </div>
        </div>
    );
}

export default SvgXudtLogoContainer;
