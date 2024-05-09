import React from 'react';

const CodeBlock = ({ code }) => {
  return (
    <pre>
      <code>
        {code}
      </code>
    </pre>
  );
};

export default CodeBlock;
