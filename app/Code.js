import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';

class Code extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cursorCorrecting: 0,
    };
  }

  componentDidMount() {
    document.addEventListener('keypress', this.handleWindowKeyPress.bind(this));
    document.addEventListener('keydown', this.handleWindowKeyDown.bind(this));
  }

  handleWindowKeyPress(e) {
    const cursor = this.cursor;
    const leftCursorPos = getComputedStyle(cursor).left;
    const cursorCorrecting = this.state.cursorCorrecting;
    console.log(getComputedStyle(cursor).left);

    if (cursorCorrecting === 1) {
      cursor.style.left = `${parseFloat(leftCursorPos) + 9.2}px`;
      this.setState({ cursorCorrecting: 0 });
    } else {
      cursor.style.left = `${parseFloat(leftCursorPos) + 10}px`;
      this.setState({ cursorCorrecting: 1 });
    }
  }

  handleWindowKeyDown(e) {
    if (e.which === 8) {
      const cursor = this.cursor;
      const leftCursorPos = getComputedStyle(this.cursor).left;
      const cursorCorrecting = this.state.cursorCorrecting;

      if (cursorCorrecting === 0) {
        cursor.style.left = `${parseFloat(leftCursorPos, 10) - 9.2}px`;
        this.setState({ cursorCorrecting: 1 });
      } else {
        cursor.style.left = `${parseFloat(leftCursorPos, 10) - 10}px`;
        this.setState({ cursorCorrecting: 0 });
      }
    }
  }

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
        <div className="code">
          <pre dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(codeToRender) }}></pre>
          <span ref={el => this.cursor = el} className="cursor"></span>
        </div>
      </div>
    );
  }
}

export default Code;