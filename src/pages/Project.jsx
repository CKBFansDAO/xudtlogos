import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import xudts from '../assets/xudts.json'
import PngXudtLogoContainer from '../components/PngXudtLogoContainer';
import SvgXudtLogoContainer from '../components/SvgXudtLogoContainer';
import useXudtProject from '../hooks/useXudtProject';

const Project = () => {
    const params = useParams()
    const symbol = params.xudt;
    //const {isLoading, isError, xudtInfo: info} = useXudtProject(symbol);

    const getProject = () => {
        // 检查输入的项目名称是否在数据结构中存在
        if (symbol in xudts) {
            // 如果存在，返回对应的值对象
            return xudts[symbol];
        } else {
            // 如果不存在，返回 null 或者适当的默认值
            return null;
        }
    }

    const info = getProject();

    useEffect(() => {
        
    }, [symbol]);

    const renderLoading = () => {
        <div className='flex flex-col gap-3 h-full items-center justify-center'>
            Loading...
        </div>
    }

    const render404 = () => {
        return <div className='flex flex-col gap-3 h-full items-center justify-center'>
            <span className='title text-7xl text-color-maintext mb-2'>404</span>
            <span>Your logo is lost or someone has stolen it,</span>
            <span>please return to the main page</span>
            <Link to={'/'} className='flex items-center text-base title text-center px-10 py-2 bg-color-maintext hover:bg-opacity-90 rounded-md text-white'>Go Home</Link>
        </div>
    }

    const renderMainView = () => {
        return <div className='flex flex-col gap-10'>
            <span className='text-xl title text-color-maintext'>{`${info.name} (${info.symbol}) PNG and SVG Logo Download`}</span>
            <div className='flex flex-wrap gap-10 md:gap-15'>
                <PngXudtLogoContainer symbol={symbol}></PngXudtLogoContainer>
                <SvgXudtLogoContainer symbol={symbol}></SvgXudtLogoContainer>

            </div>

            <div className='flex flex-col gap-5 mt-10'>
                <span className='title text-3xl md:mb-5'>Contribute</span>
                <p> You can submit a new xUDT or DOB logo to xudtlogos by opening a <span className='title'>pull request from a fork</span> of our GitHub repository. Use the <Link to='/tools' className='title text-color-main'>Tools</Link> page to check for existing logos, generate the canonical filename, and get copy-pastable git commands for the full fork → clone → commit → push → PR workflow. </p>
                <p> Alternatively, if you are the owner of the brand and the logo is being presented incorrectly, open a PR removing the file (or an issue if you cannot PR) and a maintainer will review. </p>
                <div className='flex flex-wrap gap-3'>
                    <a className='font-bold text-center rounded px-4 py-2 bg-color-maintext text-white hover:opacity-90' href={`https://github.com/CKBFansDAO/xudtlogos/fork`} target="_blank" rel="noopener noreferrer">Fork & submit a PR</a>
                    <Link to='/tools' className='font-bold text-center rounded px-4 py-2 border border-color-maintext text-color-maintext hover:bg-color-maintext hover:text-white transition-colors'>Open Tools</Link>
                </div>
            </div>

            <div>
                <p> If you value the xUDT Logos project and would like to help us continue our efforts, please consider supporting us with a &nbsp;
                    <span class="text-color-main font-semibold">donation</span>: ckb1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqddfkm2dxu807jw87smd0fwfc2rs35lx9gqm9wqv
                </p>
            </div>
        </div>
    }

    /*
    if (isLoading) {
        return renderLoading()
    }*/

    return (
        <div className='flex flex-col py-14 gap-10'>
            {!info && render404()}
            {info && renderMainView()}
        </div>
    );
}

export default Project;
