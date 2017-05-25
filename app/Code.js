import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';

class Code extends Component {
  componentDidMount() {
    const activeLine = document.querySelector('.active.line');
    const childNodes = activeLine.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      // ELEMENT_NODE
      // console.log(childNodes[i]);
      if (childNodes[i].nodeType === 1) {
        const chars = childNodes[i].textContent.split('');
        console.log(chars);
        let newHtml = '';
        for (let j = 0; j < chars.length; j++) {
          newHtml += `<span class="char topass">${chars[j]}</span>`;
        }
        console.log(newHtml);
        childNodes[i].innerHTML = newHtml;
      } 
      // console.log(childNodes[i]);

      // console.log(i);
      // TEXT_NODE
      if (childNodes[i].nodeType === 3) {
        console.log('text');
        console.log(childNodes[i]);
      }
    }
  }

  wrapCharsWithSpan() {

  }

  separateCodeByLines(code) {
    let newLine = false;
    
    code = `<span class="active line">${code}`;
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

    // highlightedCode = this.separateCodeByLines(highlightedCode);

    return (
      <div className="code-wrapper">
        <pre dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(codeToRender) }}></pre>
      </div>
    );
  }
}

export default Code;