import React, { useEffect, useState } from 'react';

const XudtLogoLoader = ({ name }) => {

    const [loadFailed, setLoadFailed] = useState(false);

    const handleLoadError = () => {
        // 标记加载失败
        setLoadFailed(true);
    };

    useEffect(() => {
        
    }, [name]);
    
    
    return (
        <div>
            {loadFailed ? (
                // 加载失败时显示名称的首字母
                <div className='h-40 w-40 text-[96px] rounded-full bg-color-main text-white font-bold flex items-center place-content-center'>{name.charAt(0).toUpperCase()}</div>
            ) : (
                // 加载成功时显示图片
                <img className='h-40 w-40' src={`/logos/${name}-logo.png`} alt={`${name} Logo`} onError={handleLoadError} />
            )}
        </div>
    );
}

export default XudtLogoLoader;
