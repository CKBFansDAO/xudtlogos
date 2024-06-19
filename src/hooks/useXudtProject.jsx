import React, { useEffect, useState } from 'react';
import tokensCache from '../components/cache/tokensCache';

const useXudtProject = ( symbol ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [xudtInfo, setXudtInfo] = useState(null);
    const [isError, setIsError] = useState(false);
    
    useEffect(() => {
        const fetchToken = async (symbol) => {
            const tokenInfo = await tokensCache.getToken(symbol);
            setXudtInfo(tokenInfo);
            setIsLoading(false);
            if (tokenInfo) {
                
            } else {
                setIsError(true);
            }
        }

        if (!isLoading || !xudtInfo) {
            fetchToken(symbol);
        }
    }, [symbol]);

    return { isLoading, isError, xudtInfo };
}

export default useXudtProject;
