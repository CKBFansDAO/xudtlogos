import React from 'react';

const About = () => {
    return (
        <div className='flex flex-col py-14 gap-14 text-color-maintext'>
            <span className='text-2xl title'>About xUDTLogos</span>
            <div className='flex flex-col gap-5'>
                <span className='title text-base '>
                    Background
                </span>
                <span>
                    With the continuous increase of xUDT assets on CKB, the need to display asset logos is becoming increasingly prominent. However, there is currently a lack of a unified platform to manage and display the logos of these assets, which poses a certain challenge to DApp developers. To address this issue, we initiated the open source project xudtlogos, aiming to provide a unified logo management solution for xUDT assets on CKB.
                </span>
            </div>
            <div className='flex flex-col gap-5'>
                <span className='title text-base '>
                    Our Solution
                </span>
                <div className='flex gap-5'>
                    <div className='w-3 h-3 place-self-center'>
                        <div className='w-2 h-2 bg-black rounded-full '></div>
                    </div>
                    <span> <span className='title'>Unified Logo Management Platform:</span> xudtlogos will provide a unified online platform where xUDT project owners can upload and manage their xutd token logos according to specifications.</span>
                </div>
                <div className='flex gap-5'>
                    <div className='w-3 h-3 place-self-center'>
                        <div className='w-2 h-2 bg-black rounded-full '></div>
                    </div>
                    <span> <span className='title'>Open Source Collaboration Model:</span> The project will adopt an open source collaboration model, welcoming community members and xUDT project owners to participate in logo upload and maintenance work.</span>
                </div>
                <div className='flex gap-5'>
                    <div className='w-3 h-3 place-self-center'>
                        <div className='w-2 h-2 bg-black rounded-full '></div>
                    </div>
                    <span> <span className='title'>Automatic Deployment and Display:</span> Once logos are uploaded and approved, the system will automatically deploy them to the public website xudtlogos.cc, making it convenient for DApp developers and users to access and use them.</span>
                </div>
                <div className='flex gap-5'>
                    <div className='w-3 h-3 place-self-center'>
                        <div className='w-2 h-2 bg-black rounded-full '></div>
                    </div>
                    <span> <span className='title'>Standardized Management:</span>  xudtlogos will establish a set of standards to ensure that uploaded logos meet uniform size, format, and quality requirements, improving display effectiveness and user experience.</span>
                </div>
                
            </div>
            <div className='flex flex-col gap-5'>
                <span className='title text-base '>
                Expected Outcomes
                </span>
                <div className='flex gap-5'>
                    <div className='w-3 h-3 place-self-center'>
                        <div className='w-2 h-2 bg-black rounded-full '></div>
                    </div>
                    <span>Provide a unified logo display platform for xUDT assets on CKB, enhancing convenience and user experience for DApp developers and users.</span>
                </div>
                <div className='flex gap-5'>
                    <div className='w-3 h-3 place-self-center'>
                        <div className='w-2 h-2 bg-black rounded-full '></div>
                    </div>
                    <span>Facilitate cooperation and communication between xUDT project owners and DApp developers, promoting the development and growth of the CKB ecosystem.</span>
                </div>
            </div>
            <span className='title '>
            We look forward to the community's support and feedback, let's work together to contribute to the prosperity and health of the CKB ecosystem!
            </span>
        </div>
    );
}

export default About;
