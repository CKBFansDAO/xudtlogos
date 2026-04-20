import React, { useEffect, useState } from 'react';

// 会话级的缺失符号集合。仅记录 404 过的 symbol，避免同一次访问中
// 重复发起已知会失败的请求。成功的 logo 由浏览器 HTTP 缓存负责去重，
// 无需 JS 侧缓存。此 Set 只存字符串，内存占用极小，刷新后自动清空，
// 新上传的 logo 会在下一次刷新时自然出现。
const missingSymbols = new Set();

// 兼容不同来源传入的 symbol：去掉前导点，空格 / 斜杠压缩为单个 `-`，
// 全部小写。保证同一资产无论大小写或空格差异都落在同一个 URL / 缓存键。
const normalizeSymbol = (symbol) =>
    String(symbol || '')
        .trim()
        .replace(/^\./, '')
        .replace(/[\s/]+/g, '-')
        .toLowerCase();

const XudtLogoLoader = ({ symbol, sizeStyle }) => {

    const normalized = normalizeSymbol(symbol);
    const [loadFailed, setLoadFailed] = useState(() => missingSymbols.has(normalized));

    const handleLoadError = () => {
        missingSymbols.add(normalized);
        setLoadFailed(true);
    };

    useEffect(() => {
        setLoadFailed(missingSymbols.has(normalizeSymbol(symbol)));
    }, [symbol]);

    const initial = (symbol && symbol.charAt(0).toUpperCase()) || '?';

    return (
        <div>
            {loadFailed ? (
                // 加载失败时显示名称的首字母
                <div className={`${sizeStyle || 'h-40 w-40 text-[96px]'}  rounded-full bg-color-main text-white font-bold flex items-center place-content-center`}>{initial}</div>
            ) : (
                // 加载成功时显示图片。浏览器 HTTP 缓存自动处理二进制去重，
                // 只要所有调用使用同一个 URL（不要加随机 query 参数）。
                <img
                    className={`${sizeStyle || 'h-40 w-40'}`}
                    src={`/logos/${normalized}-logo.png`}
                    alt={`xudt-${normalized}-logo`}
                    loading="lazy"
                    decoding="async"
                    onError={handleLoadError}
                />
            )}
        </div>
    );
}

export default XudtLogoLoader;
