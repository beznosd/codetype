import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';

class Code extends Component {
  render() {
    const highlightedCode = Prism.highlight(this.props.code, Prism.languages.javascript);
    
    // wrap code with span
    const regexp = /(<\/?span.*?>)/;
    const tagsAndTextArr = highlightedCode.split(regexp);
    let codeToRender = '';

    for (let i = 0; i < tagsAndTextArr.length; i++) {
      // if text element wrap each symbol with span
      if (tagsAndTextArr[i] !== '' && !regexp.test(tagsAndTextArr[i])) {
        let newHtml = '';
        for (let j = 0; j < tagsAndTextArr[i].length; j++) {
          newHtml += `<span class="char topass">${tagsAndTextArr[i][j]}</span>`;
        }
        tagsAndTextArr[i] = newHtml;
      }
      codeToRender += tagsAndTextArr[i];
    }

    return (
      <div className="code-wrapper">
        <pre dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(codeToRender) }}></pre>
      </div>
    );
  }
}

export default Code;