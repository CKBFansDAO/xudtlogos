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
                <p> You can submit a new xUDT asset logo to xudtlogos by creating a new pull request to our github repository, also by creating an new issue. </p>
                <p> Alternatively, if you are the owner of the brand, and if the logo is presented or being used in a wrong way, you can request the logo to be removed. </p>
                <a className='font-bold text-center rounded w-40 py-2 bg-color-maintext text-white' href={`https://github.com/CKBFansDAO/xudtlogos/issues/new?assignees=yixyxiu&labels=new+logo&projects=&template=add-xxxx-xxx-logo.md&title=%5BREQ%5DAdd+Nervos+Network+-+CKB+logo+`} target="_blank" rel="noopener noreferrer">Submit new Logo</a>
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
