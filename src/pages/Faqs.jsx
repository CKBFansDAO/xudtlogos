import React from 'react';

const Faqs = () => {
    return (
        <div className='flex flex-col py-14 gap-14 text-color-maintext'>
            <span className='text-2xl title'>FAQs</span>
            <div className='flex flex-col gap-5'>
                <span className='title text-base '>
                How to submit a new logo to xudtlogos.cc?
                </span>
                <span>
                To submit a new logo for a xUDT asset, please <span className='title'>create a new issue </span> on our <a className='title text-color-main' href={`https://github.com/CKBFansDAO/xudtlogos/issues/new?assignees=yixyxiu&labels=new+logo&projects=&template=add-xxxx-xxx-logo.md&title=%5BREQ%5DAdd+Nervos+Network+-+CKB+logo+`} target="_blank" rel="noopener noreferrer">GitHub </a> , select the "Add xxxx-xxx Logo" template, and submit the relevant information as required by the template.
                </span>
            </div>
            <div className='flex flex-col gap-5'>
                <span className='title text-base '>
                How to update a logo on xudtlogos.cc?
                </span>
                <span>
                If you wish to update an existing logo, e.g. add additional logo versions, include your website link, please <span className='title'>create a new issue </span> on our <a className='title text-color-main' href={`https://github.com/CKBFansDAO/xudtlogos/issues/new?assignees=yixyxiu&labels=new+logo&projects=&template=add-xxxx-xxx-logo.md&title=%5BREQ%5DAdd+Nervos+Network+-+CKB+logo+`} target="_blank" rel="noopener noreferrer">GitHub </a> , select the "Add xxxx-xxx Logo" template, and submit the relevant information as required by the template.
                </span>
            </div>
            <div className='flex flex-col gap-5'>
                <span className='title text-base '>
                How to remove a logo from xudtlogos.cc?
                </span>
                <span>
                If you wish to remove a logo from xudtlogos.cc collection, please <span className='title'>create a new issue </span> on our <a className='title text-color-main' href={`https://github.com/CKBFansDAO/xudtlogos/issues/new?assignees=yixyxiu&labels=new+logo&projects=&template=add-xxxx-xxx-logo.md&title=%5BREQ%5DAdd+Nervos+Network+-+CKB+logo+`} target="_blank" rel="noopener noreferrer">GitHub </a> , select the "Add xxxx-xxx Logo" template, and submit the relevant information as required by the template. We will remove the logo in a timely manner, according to the official claim or branding guidelines.
                </span>
            </div>
            <div className='flex flex-col gap-5'>
                <span className='title text-base '>
                What are the differences between SVG and PNG file formats?
                </span>
                <span>
                SVG and PNG are two common file formats used for images. The main difference between the two is the way they represent graphics. PNG files are made up of pixels, while SVG files are made up of vectors.
                </span>
                <span>
                Pixels are tiny squares of color that are arranged in a grid to create an image. When you zoom in on a PNG image, you can see the individual pixels that make up the image. This is why PNG images can appear blurry or pixelated when they are resized or zoomed in.
                </span>
                <span>
                Vectors, on the other hand, are made up of lines and shapes that are defined by mathematical equations. This means that SVG images can be scaled up or down without losing quality. When you zoom in on an SVG image, the lines and shapes remain sharp and clear, no matter how much you zoom in.
                </span>
                <span>
                For this reason, SVG is generally considered the better option for images that need to be resized or scaled, such as logos or icons. Additionally, SVG files can be used as a source and easily converted to other formats, including PNG. PNG files, on the other hand, cannot be converted into vectors, so it's important to prioritize using SVG as a source when possible.
                </span>
            </div>
            <div className='flex flex-col gap-5'>
                <span className='title text-base '>
                Are xUDT logos protected by intellectual property laws, or can they be used without restriction?
                </span>
                <span>
                Check the official brand guidelines (brandbook) on the xUDT project's website for logo usage information.
                </span>
                <span>
                If no guidelines are available, contact the project team for permission.
                </span>
            </div>
        </div>
    );
}

export default Faqs;
