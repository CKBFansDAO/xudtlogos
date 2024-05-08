import React from 'react';
import { useParams } from 'react-router-dom';
import xudts from '../assets/xudts.json'
import XudtLogoLoader from '../components/XudtLogoLoader';
import PngXudtLogoContainer from '../components/PngXudtLogoContainer';
import SvgXudtLogoContainer from '../components/SvgXudtLogoContainer';

const Project = () => {

    const params = useParams()
    const symbol = params.xudt;

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

    const renderMainView = () => {
        return <div className='flex flex-col gap-10'>
            <span className='text-3xl title'>{`${info.name} (${info.symbol}) PNG and SVG Logo Download`}</span>
            <div className='flex flex-wrap gap-10 md:gap-28'>
                <PngXudtLogoContainer symbol={symbol}></PngXudtLogoContainer>
                <SvgXudtLogoContainer symbol={symbol}></SvgXudtLogoContainer>

            </div>

            <div className='flex flex-col gap-5'>
                <span className='title text-3xl md:mb-5'>Contribute</span>
                <p> You can submit a new xUDT asset logo to xudtlogs by creating a new pull request to our github repository. </p>
                <p> Alternatively, if you are the owner of the brand, and if the logo is presented or being used in a wrong way, you can request the logo to be removed. </p>
                <a className='font-bold text-center rounded w-40 py-2 bg-color-main text-white' href={`https://github.com/CKBFansDAO/xudtlogos/pulls`} target="_blank">Submit</a>
            </div>

            <div>
                <p> If you value the xUDT Logos project and would like to help us continue our efforts, please consider supporting us with a &nbsp;
                    <a href="" target="_blank" class="underline">donation</a>.
                </p>
            </div>
        </div>
    }

    return (
        <div className='flex flex-col py-10 gap-10'>
            {!info && <>404</>}
            {info && renderMainView()}
        </div>
    );
}

export default Project;
