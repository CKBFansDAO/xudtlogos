import React, { useEffect, useState } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import 'github-markdown-css';
import './MarkdownViewer.css'

const MarkdownViewer = ({ filePath }) => {

    const [markdownContent, setMarkdownContent] = useState('');
    useEffect(() => {
        const fetchMarkdown = async () => {
            try {
                const response = await fetch(filePath); // 根据实际文件路径获取 Markdown 文件
                const text = await response.text();
                setMarkdownContent(text);
            } catch (error) {
                console.error('Failed to fetch Markdown file:', error);
            }
        };

        fetchMarkdown();
    }, [filePath]);

    return (<div className={`w-full py-5 px-5 md:px-0 md:py-10`}>
        <div className="markdown-body overflow-x-auto md:px-5 ">
            <MarkdownPreview source={markdownContent} />
        </div>

    </div>
    );
};

export default MarkdownViewer;