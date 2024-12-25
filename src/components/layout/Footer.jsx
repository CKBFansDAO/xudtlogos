import React from 'react';
import { ReactComponent as GithubLogo } from '../../assets/images/github.svg';

const Footer = () => {
    return (
        <div className='flex flex-col justify-center w-full px-5 h-[100px] bg-color-maintext text-white'>

            <div className='flex flex-col items-center justify-center py-5 gap-3'>
                <span>Copyright © 2024, xudtlogos.cc</span>
                <div className='flex gap-2'>
                    <span>❤️‍🔥 Built by CKBFans community with ❤️‍🔥</span>
                    <a href='https://github.com/CKBFans/xudtlogos.cc' className='flex items-center gap-1 hover:text-blue-400' target='_blank' rel="noopener noreferrer">
                        <span>GitHub</span>
                        <GithubLogo className='w-5 h-5 fill-white' />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Footer;
