### FAQs

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
        <div className={`${sizeStyle || "h-40 w-40 text-[96px]"} rounded-full 
            bg-[#50F412] text-black font-bold flex items-center place-content-center`}>
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
### **How to submit a new logo to xudtlogos.cc?**

To submit a new logo for a xUDT asset, please create a new issue on our GitHub , select the "Add xxxx-xxx Logo" template, and submit the relevant information as required by the template.

### **How to update a logo on xudtlogos.cc?**

If you wish to update an existing logo, e.g. add additional logo versions, include your website link, please create a new issue on our GitHub , select the "Add xxxx-xxx Logo" template, and submit the relevant information as required by the template.

### **How to remove a logo from xudtlogos.cc?**
If you wish to remove a logo from xudtlogos.cc collection, please create a new issue on our GitHub , select the "Add xxxx-xxx Logo" template, and submit the relevant information as required by the template. We will remove the logo in a timely manner, according to the official claim or branding guidelines.

### **What are the differences between SVG and PNG file formats?**
SVG and PNG are two common file formats used for images. The main difference between the two is the way they represent graphics. PNG files are made up of pixels, while SVG files are made up of vectors.
Pixels are tiny squares of color that are arranged in a grid to create an image. When you zoom in on a PNG image, you can see the individual pixels that make up the image. This is why PNG images can appear blurry or pixelated when they are resized or zoomed in.
Vectors, on the other hand, are made up of lines and shapes that are defined by mathematical equations. This means that SVG images can be scaled up or down without losing quality. When you zoom in on an SVG image, the lines and shapes remain sharp and clear, no matter how much you zoom in.
For this reason, SVG is generally considered the better option for images that need to be resized or scaled, such as logos or icons. Additionally, SVG files can be used as a source and easily converted to other formats, including PNG. PNG files, on the other hand, cannot be converted into vectors, so it's important to prioritize using SVG as a source when possible.

### **Are xUDT logos protected by intellectual property laws, or can they be used without restriction?**
Check the official brand guidelines (brandbook) on the xUDT project's website for logo usage information.
If no guidelines are available, contact the project team for permission.