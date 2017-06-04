import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
// import hashSum from 'hash-sum';

class Code extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSymbol: null,
      cursorCorrecting: 0,
      leftCursorPos: 0,
      topCursorPos: 0 
    };
  }

  componentDidMount() {
    document.addEventListener('keypress', this.handleWindowKeyPress.bind(this));
    document.addEventListener('keydown', this.handleWindowKeyDown.bind(this));

    const toPass = document.getElementsByClassName('topass')[0];
    this.setState({ currentSymbol: toPass });
  }

  componentWillReceiveProps() {
    this.setState({
      currentSymbol: null,
      cursorCorrecting: 0,
      leftCursorPos: 0,
      topCursorPos: 0 
    });
  }

  componentDidUpdate() {
    if (this.state.currentSymbol === null) {
      const toPass = document.getElementsByClassName('topass')[0];
      this.setState({ currentSymbol: toPass });
    }
  }

  getNextSymbol(domNode) {
    let next = domNode.nextElementSibling;
    if (next !== null && next.classList.contains('topass')) {
      // console.log('just next element');
      return next;
    }

    const parent = domNode.parentElement;
    if (parent.tagName !== 'PRE') {
      next = parent.nextElementSibling;
      if (next !== null && next.classList.contains('topass')) {
        // console.log('next after parent');
        return next;
      }

      next = parent.nextElementSibling.firstElementChild;
      if (next !== null && next.classList.contains('topass')) {
        // console.log('first child of next after parent');
        return next;
      }
    }

    if (parent.tagName === 'PRE') {
      next = domNode.nextElementSibling.firstElementChild;
      if (next !== null && next.classList.contains('topass')) {
        // console.log('first child of next');
        return next;
      }
    }
    
    // console.log(parent);

    console.log('error in getNextSymbol');
    return 'error';
  }

  getPrevToPass() {

  }

  // for trivial keys
  handleWindowKeyPress(e) {
    // cheking the symbol
    const currentSymbol = this.state.currentSymbol;

    const typedSymbolCode = e.which;
    const currentSymbolCode = currentSymbol.innerText.charCodeAt(0);

    // when new line, do nothing if not typed 'enter'
    if (currentSymbolCode === 10 && typedSymbolCode !== 13) {
      // TO DO change cursor to red then back to green
      return;
    }

    if (typedSymbolCode === currentSymbolCode) {
      currentSymbol.classList.remove('topass');
      currentSymbol.classList.add('passed');
      // this.setState({ currentSymbol: currentSymbol.nextElementSibling });
    } else {
      currentSymbol.classList.add('notpassed');
    }

    const next = this.getNextSymbol(currentSymbol);
    this.setState({ currentSymbol: next });
    // console.log(next);

    // moving the cursor

    // when new line
    if (currentSymbolCode === 10 && typedSymbolCode === 13) {
      this.setState({ 
        cursorCorrecting: 0,
        leftCursorPos: 0,
        topCursorPos: this.state.topCursorPos + 18
      });
      return;
    }

    // when the same line
    if (this.state.cursorCorrecting === 1) {
      this.setState({ 
        cursorCorrecting: 0, 
        leftCursorPos: this.state.leftCursorPos + 9.2
      });
    } else {
      this.setState({ 
        cursorCorrecting: 1, 
        leftCursorPos: this.state.leftCursorPos + 10 
      });
    }
  }

  // for backspace
  handleWindowKeyDown(e) {
    // moving the cursor back
    if (e.which === 8) {
      if (this.state.leftCursorPos <= 0) {
        return;
      }

      if (this.state.cursorCorrecting === 0) {
        this.setState({ 
          cursorCorrecting: 1, 
          leftCursorPos: this.state.leftCursorPos - 9.2
        });
      } else {
        this.setState({ 
          cursorCorrecting: 0, 
          leftCursorPos: this.state.leftCursorPos - 10 
        });
      }
    }
  }

  render() {
    const highlightedCode = Prism.highlight(this.props.code, Prism.languages.javascript);
    // console.log(highlightedCode);
    // console.log('------------------------------------------------------------------------');
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
          <span 
            style={{ left: `${this.state.leftCursorPos}px`, top: `${this.state.topCursorPos}px` }} 
            ref={el => this.cursor = el} 
            className="cursor">
          </span>
        </div>
      </div>
    );
  }
}

export default Code;