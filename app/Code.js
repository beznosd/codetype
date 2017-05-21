import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';

class Code extends Component {
  render() {
    const highlightedCode = Prism.highlight(this.props.code, Prism.languages.javascript);
    return (
      <div className="code-wrapper">
        <pre dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(highlightedCode) }}></pre>
      </div>
    );
  }
}

export default Code;