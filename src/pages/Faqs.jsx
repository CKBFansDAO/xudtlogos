import React from 'react';
import { Link } from 'react-router-dom';
import MarkdownViewer from '../components/markdownviewer/MarkdownViewer'

const REPO_BASE = 'https://github.com/CKBFansDAO/xudtlogos';
const FORK_URL = `${REPO_BASE}/fork`;
const ISSUES_URL = `${REPO_BASE}/issues`;

const Faqs = () => {

    return (
        <div className='w-full flex flex-col py-14 gap-5 text-base text-color-maintext'>
            <span className='text-2xl title px-5'>FAQs</span>
            <div className='flex flex-col gap-5'>
                <MarkdownViewer filePath={'/markdown/faqs.md'}></MarkdownViewer>
            </div>
        </div>
    );
}

export default Faqs;
