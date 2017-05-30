import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';

class Code extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cursorCorrecting: 0,
      symbolToPass: ''
    };
  }

  componentDidMount() {
    document.addEventListener('keypress', this.handleWindowKeyPress.bind(this));
    document.addEventListener('keydown', this.handleWindowKeyDown.bind(this));

    const toPass = document.getElementsByClassName('topass')[0];
    this.setState({ symbolToPass: toPass });
    // console.log(toPass.innerText);
  }

  // for trivial keys
  handleWindowKeyPress(e) {
    // cheking the symbol
    const symbolToPass = this.state.symbolToPass;

    const typedSymbolCode = e.which;
    const symbolToPassCode = symbolToPass.innerText.charCodeAt(0);
    
    if (typedSymbolCode === symbolToPassCode) {
      symbolToPass.classList.remove('topass');
      symbolToPass.classList.add('passed');
      
      // this.setState({ symbolToPass: symbolToPass.nextElementSibling });
    } else {
      symbolToPass.classList.add('notpassed');
    }

    this.setState({ symbolToPass: symbolToPass.nextElementSibling });

    // moving the cursor
    const cursor = this.cursor;
    const leftCursorPos = parseFloat(getComputedStyle(cursor).left);
    const cursorCorrecting = this.state.cursorCorrecting;

    if (cursorCorrecting === 1) {
      cursor.style.left = `${leftCursorPos + 9.2}px`;
      this.setState({ cursorCorrecting: 0 });
    } else {
      cursor.style.left = `${leftCursorPos + 10}px`;
      this.setState({ cursorCorrecting: 1 });
    }
  }

  // for backspace
  handleWindowKeyDown(e) {
    if (e.which === 8) {
      // moving the cursor
      const cursor = this.cursor;
      const leftCursorPos = parseFloat(getComputedStyle(cursor).left);
      const cursorCorrecting = this.state.cursorCorrecting;

      if (leftCursorPos <= 0) {
        return;
      }

      if (cursorCorrecting === 0) {
        cursor.style.left = `${leftCursorPos - 9.2}px`;
        this.setState({ cursorCorrecting: 1 });
      } else {
        cursor.style.left = `${leftCursorPos - 10}px`;
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