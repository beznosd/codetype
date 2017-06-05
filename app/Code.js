import React, { Component } from 'react';
// import hashSum from 'hash-sum';

class Code extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstSymbol: null,
      lastSymbol: null,
      currentSymbol: null,
      cursorCorrecting: 0,
      leftCursorPos: 0,
      topCursorPos: 0,
      linesLastCursorPositions: []
    };
  }

  componentDidMount() {
    document.addEventListener('keypress', this.handleWindowKeyPress.bind(this));
    document.addEventListener('keydown', this.handleWindowKeyDown.bind(this));

    const toPassSymbols = document.getElementsByClassName('topass');
    this.setState({ 
      firstSymbol: toPassSymbols[0],
      currentSymbol: toPassSymbols[0],
      lastSymbol: toPassSymbols[toPassSymbols.length - 1]
    });
  }

  componentWillReceiveProps() {
    this.setState({
      firstSymbol: null,
      lastSymbol: null,
      currentSymbol: null,
      cursorCorrecting: 0,
      leftCursorPos: 0,
      topCursorPos: 0,
      linesLastCursorPositions: []
    });
  }

  componentDidUpdate() {
    if (this.state.currentSymbol === null) {
      const toPassSymbols = document.getElementsByClassName('topass');
      this.setState({ 
        firstSymbol: toPassSymbols[0],
        currentSymbol: toPassSymbols[0],
        lastSymbol: toPassSymbols[toPassSymbols.length - 1]
      });

      this.cursor.classList.remove('hide');
      document.getElementsByClassName('stats')[0].classList.add('hide');
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
    
    console.log('error in getNextSymbol');
    return 'error';
  }

  getPrevSymbol() {
    const domNode = this.state.currentSymbol;

    let prev = domNode.previousElementSibling;
    if (prev !== null && hasPrevClasses(prev)) {
      return prev;
    }

    const parent = domNode.parentElement;
    if (parent.tagName !== 'PRE') {
      prev = parent.previousElementSibling;
      if (prev !== null && hasPrevClasses(prev)) {
        // console.log('prev before parent');
        return prev;
      }

      prev = parent.previousElementSibling.lastElementChild;
      if (prev !== null && hasPrevClasses(prev)) {
        // console.log('first child of prev before parent');
        return prev;
      }
    }

    if (parent.tagName === 'PRE') {
      prev = domNode.previousElementSibling.lastElementChild;
      if (prev !== null && hasPrevClasses(prev)) {
        // console.log('last child of prev');
        return prev;
      }
    }

    function hasPrevClasses(domNode) {
      return domNode.classList.contains('passed') || domNode.classList.contains('notpassed');
    }

    console.log('error in getPrevSymbol');
    return 'error';
  }

  // for trivial keys
  handleWindowKeyPress(e) {
    e.preventDefault();
    
    // cheking the symbol
    const currentSymbol = this.state.currentSymbol;

    const typedSymbolCode = e.which;
    const currentSymbolCode = currentSymbol.innerText.charCodeAt(0);

    // when new line, do nothing if not typed 'enter'
    if (currentSymbolCode === 10 && typedSymbolCode !== 13) {
      // TODO change cursor to red then back to green
      return;
    }
    // when not new line, do nothing if not typed 'enter'
    if (currentSymbolCode !== 10 && typedSymbolCode === 13) {
      // TODO change cursor to red then back to green
      return;
    }

    if (typedSymbolCode === currentSymbolCode) {
      currentSymbol.classList.remove('topass');
      currentSymbol.classList.add('passed');
    } else {
      currentSymbol.classList.remove('topass');
      currentSymbol.classList.add('notpassed');
    }

    // if last symbol reached
    if (this.state.currentSymbol === this.state.lastSymbol) {
      // console.log('Success!!!))) The last symbol reached');
      this.cursor.classList.add('hide');
      document.getElementsByClassName('stats')[0].classList.remove('hide');
      // TODO show congrats and little stats
      return;
    }

    const next = this.getNextSymbol(currentSymbol);
    this.setState({ currentSymbol: next });

    // moving the cursor

    // when new line
    if (currentSymbolCode === 10 && typedSymbolCode === 13) {
      const linesLastCursorPositions = this.state.linesLastCursorPositions;
      linesLastCursorPositions.push(this.state.leftCursorPos);

      this.setState({ 
        cursorCorrecting: 0,
        leftCursorPos: 0,
        topCursorPos: this.state.topCursorPos + 18,
        linesLastCursorPositions
      });

      return;
    }

    // when tab symbol reached
    if (currentSymbolCode === 9 && typedSymbolCode === 9) {
      console.log('test');
      this.setState({ 
        leftCursorPos: this.state.leftCursorPos + currentSymbol.offsetWidth
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

  // for backspace and tab
  handleWindowKeyDown(e) {
    // moving the cursor further if 'tab' key pressed
    if (e.which === 9) {
      e.preventDefault();

      const currentSymbol = this.state.currentSymbol;
      const currentSymbolCode = currentSymbol.innerText.charCodeAt(0);
      if (currentSymbolCode === 9) {
        this.handleWindowKeyPress(e);
      }
      if (currentSymbolCode === 32) {
        // count all next space
        let counter = 0;
        // console.log(currentSymbol.nextElementSibling.innerText.charCodeAt(0));
        let currentEl = currentSymbol;
        let summToAdd = this.state.leftCursorPos;
        while (currentEl.innerText.charCodeAt(0) === 32) {
          if (counter % 2) {
            summToAdd += 9.2;
          } else {
            summToAdd += 10;
          }
          currentEl.classList.remove('topass');
          currentEl.classList.add('passed');
          currentEl = currentEl.nextElementSibling;
          counter++;
        }
        if (counter === 1) {
          // TODO change cursor to red then back to green
          // single spaces for just for space
        } else {
          // move cursor through spaces ;)
          this.setState({
            leftCursorPos: this.state.leftCursorPos + summToAdd,
            currentSymbol: this.getNextSymbol(currentEl.previousElementSibling)
          });
        }
      }
    }

    // moving the cursor back if 'backspace' key pressed
    if (e.which === 8) {
      if (this.state.currentSymbol === this.state.firstSymbol) {
        // TODO change cursor to red then back to green
        console.log('very first matched');
        return;
      }

      const currentSymbol = this.getPrevSymbol();
      const currentSymbolCode = currentSymbol.innerText.charCodeAt(0);
      // console.log(currentSymbol);

      this.setState({ currentSymbol });

      currentSymbol.classList.remove('notpassed');
      currentSymbol.classList.add('topass');

      if (currentSymbolCode === 10) {
        const linesLastCursorPositions = this.state.linesLastCursorPositions;
        // const prevLineCursorPos = linesLastCursorPositions[linesLastCursorPositions.length - 1];
        this.setState({
          cursorCorrecting: 0,
          leftCursorPos: linesLastCursorPositions.pop(),
          topCursorPos: this.state.topCursorPos - 18,
          linesLastCursorPositions
        });
        return;
      }

      // when the same line
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
    return (
      <div className="code-wrapper">
        <div className="code">
          <pre dangerouslySetInnerHTML={{ __html: this.props.code }}></pre>
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