import React from 'react';
import { useParams } from 'react-router-dom';
import xudts from '../assets/xudts.json'

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
            <span className='text-3xl'>{`${info.name} (${info.symbol}) PNG and SVG Logo Download`}</span>
            <div className='flex flex-col md:flex-row gap-5 md:gap-10'>
                <div className='w-60 h-60 rounded-md border border-[#aaa] flex items-center justify-center'>
                    <img className='w-40 h-40' src={`/logos/${symbol}-logo.png`} alt={`xudt-${symbol}-logo.png`} />
                </div>

                <div className='flex flex-col gap-10 place-content-center'>
                    <div className='flex flex-col'>
                        <span className='text-2xl'>Raster file</span>
                        <span className=''>Transparent</span>
                    </div>
                    <div className='flex flex-col gap-5'>
                        <a className='font-bold underline underline-offset-2' href={`/logos/${symbol}-logo.png`} target="_blank">{`xudt-${symbol}-logo.png`}</a>
                        <a className='font-bold text-center rounded py-2 bg-color-main text-white' href={`/logos/${symbol}-logo.png`} target="_blank">Download</a>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-5'>
                <span className='text-3xl md:mb-5'>Contribute</span>
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
