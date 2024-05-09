1. Create a new file named `XudtLogoLoader.jsx`, then paste the following code into that file:

```jsx
import React, { useEffect, useState } from "react";

const XudtLogoLoader = ({ symbol, sizeStyle }) => {
  const [loadFailed, setLoadFailed] = useState(false);

  const handleLoadError = () => {
    // 标记加载失败
    setLoadFailed(true);
  };

  useEffect(() => {}, [symbol]);

  return (
    <div>
      {loadFailed ? (
        // 加载失败时显示名称的首字母
        <div className={`${sizeStyle || "h-40 w-40 text-[96px]"} rounded-full bg-[#378ACA] text-black font-bold flex items-center place-content-center`}>
          {symbol.charAt(0).toUpperCase()}
        </div>
      ) : (
        // 加载成功时显示图片
        <img
          className={`${sizeStyle || "h-40 w-40"}`}
          src={`https://xudtlogos.cc/logos/${symbol}-logo.png`}
          alt={`xudt-${symbol}-logo`}
          onError={handleLoadError}
        />
      )}
    </div>
  );
};

export default XudtLogoLoader;
```

2. Use `XudtLogoLoader`:
```jsx
    <XudtLogoLoader symbol={xudtInfo.symbol} sizeStyle={'w-24 h-24 text-5xl'}></XudtLogoLoader>
```
We assume that the data object containing the xUDT symbol field is called xudtInfo.

>The CSS styles in the above code are provided as an example using tailwindcss. You can adjust them according to your own application.
