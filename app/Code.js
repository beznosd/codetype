import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';

class Code extends Component {
  separateCodeByLines(code) {
    let newLine = false;
    
    code = `<span class="line">${code}`;
    for (let i = 0; i < code.length; i++) {
      if (code[i].charCodeAt(0) === 10 && newLine === false) {
        code = `${code.slice(0, i)}</span>${code.slice(i)}`;
        newLine = true;
      }

      if (i !== 0 && code[i - 1].charCodeAt(0) === 10 && code[i].charCodeAt(0) !== 10 && newLine === true) {
        code = `${code.slice(0, i)}<span class="line">${code.slice(i)}`;
        newLine = false;
      }
    }
    code += '</span>';
  
    return code;
  }

  render() {
    let highlightedCode = Prism.highlight(this.props.code, Prism.languages.javascript);
    highlightedCode = this.separateCodeByLines(highlightedCode);

    return (
      <div className="code-wrapper">
        <pre dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(highlightedCode) }}></pre>
      </div>
    );
  }
}

export default Code;