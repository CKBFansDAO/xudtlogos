import React, { useEffect, useState } from 'react';

const useXudtLogo = ({symbol, logoType}) => {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await fetch(`logos/${symbol}-logo.${logoType}`);
                //console.log(response);
                if (response.ok && response.headers.get('Content-Type')?.startsWith('image/')) {
                    // 确保响应内容类型为图片
                    //console.log(response.headers.get('Content-Type'))
                    setLoaded(true);
                } else {
                    //console.log(response.headers.get('Content-Type'))
                    //console.log('false');
                }
            } catch (error) {
                
            }
            setLoading(false);
        };

        fetchLogo();
    }, [symbol, logoType]);

    return { isLoading, loaded };
}

export default useXudtLogo;
