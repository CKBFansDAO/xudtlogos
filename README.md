<h1 align="center" style="font-size: 64px;">
  xudtlogos
</h1>

<p align="center">
  <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/ckbfansdao/xudtlogos" />
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/ckbfansdao/xudtlogos/master" />
  <img alt="GitHub branch check runs" src="https://img.shields.io/github/check-runs/ckbfansdao/xudtlogos/master" />
  <a href="https://deepwiki.com/CKBFansDAO/xudtlogos">
    <img alt="Ask DeepWiki" src="https://deepwiki.com/badge.svg">
  </a>
</p>

## Background

With the continuous increase of xUDT assets on CKB, the need to display asset logos is becoming increasingly prominent. However, there is currently a lack of a unified platform to manage and display the logos of these assets, which poses a certain challenge to DApp developers. To address this issue, We initiated the open source project xudtlogos, aiming to provide a unified logo management solution for xUDT assets on CKB.

## Our solution

- Unified Logo Management Platform: xudtlogos will provide a unified online platform where xUDT project owners can upload and manage their token logos according to specifications.
- Open Source Collaboration Model: The project will adopt an open source collaboration model, welcoming community members and xUDT project owners to participate in logo upload and maintenance work.
- Automatic Deployment and Display: Once logos are uploaded and approved, the system will automatically deploy them to the public website xudtlogos.cc, making it convenient for DApp developers and users to access and use them.
- Standardized Management: xudtlogos will establish a set of standards to ensure that uploaded logos meet uniform size, format, and quality requirements, improving display effectiveness and user experience.

## Logo Specifications

To ensure consistent display quality across all platforms, xUDT logos uploaded to xudtlogos must meet the following specifications:

### Size Requirements
- **Primary Size**: 256x256 pixels (recommended for best display quality)
- **Minimum Size**: 128x128 pixels (smaller sizes will be rejected)
- **Maximum Size**: 512x512 pixels (larger sizes will be automatically resized)
- **Aspect Ratio**: Must be 1:1 (square logos only)

### File Format
- **Supported Upload Formats**: PNG and SVG only (available for third-party download)
- **PNG**: Required format. Every logo must be uploaded as a PNG file, since some projects may not have an SVG version designed.
- **SVG**: Optional but encouraged when a vector version of the logo is available.
- **Color Depth**: 32-bit (RGBA) for PNG files with transparency support

> **In-app Display Recommendation**: When integrating xudtlogos into a web application, it is recommended to use the `XudtLogoLoader` component. The `<img>` tag inside this component uniformly loads the PNG version (e.g. `https://xudtlogos.cc/logos/{symbol}-logo.png`) to ensure consistent rendering across all xUDT assets, regardless of whether an SVG version exists. See the FAQs page for the full `XudtLogoLoader` implementation.

### File Size Limits
- **PNG Maximum File Size**: 500 KB
- **PNG Recommended File Size**: Under 100 KB for optimal loading performance
- **SVG Maximum File Size**: 50 KB (should be optimized/minified)

### Quality Criteria
- **Resolution**: Minimum 72 DPI, recommended 144 DPI or higher
- **Transparency**: Must have transparent background (no solid color backgrounds)
- **Clarity**: Logo must be sharp and legible at all sizes from 32px to 256px
- **Anti-aliasing**: Required for smooth edges on raster images
- **Color Accuracy**: Colors should match the official brand colors

### Additional Guidelines
- No text or borders around the logo image
- Logo should be centered within the image canvas
- Avoid gradients or complex effects that may not render well at small sizes
- For dark/light mode compatibility, ensure logo is visible on both backgrounds
- Do not include version numbers, taglines, or additional text in the logo file

## Expected Outcomes

- Provide a unified logo display platform for xUDT assets on CKB, enhancing convenience and user experience for DApp developers and users.
- Facilitate cooperation and communication between xUDT project owners and DApp developers, promoting the development and growth of the CKB ecosystem.

We look forward to the community's support and feedback, let's work together to contribute to the prosperity and health of the CKB ecosystem!