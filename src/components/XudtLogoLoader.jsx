import React, { useEffect, useState } from 'react';

const XudtLogoLoader = ({ symbol, sizeStyle }) => {

    const [loadFailed, setLoadFailed] = useState(false);

    const handleLoadError = () => {
        // 标记加载失败
        setLoadFailed(true);
    };

    useEffect(() => {
        
    }, [symbol]);
    
    
    return (
        <div>
            {loadFailed ? (
                // 加载失败时显示名称的首字母
                <div className={`${sizeStyle || 'h-40 w-40 text-[96px]'}  rounded-full bg-color-main text-white font-bold flex items-center place-content-center`}>{symbol.charAt(0).toUpperCase()}</div>
            ) : (
                // 加载成功时显示图片
                <img className={`${sizeStyle || 'h-40 w-40'}`} src={`/logos/${symbol}-logo.png`} alt={`xudt-${symbol}-logo`} onError={handleLoadError} />
            )}
        </div>
    );
}

export default XudtLogoLoader;
