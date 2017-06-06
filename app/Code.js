import React, { Component } from 'react';

class Code extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstSymbol: null,
      lastSymbol: null,
      currentSymbol: null,
      currentSymbolNum: 0,
      leftCursorPos: 0,
      topCursorPos: 0,
      linesLastCursorPositions: []
    };
  }

  componentDidMount() {
    document.addEventListener('keypress', this.handleWindowKeyPress.bind(this));
    document.addEventListener('keydown', this.handleWindowKeyDown.bind(this));
    this.updateStateSymbols();
  }

  componentWillReceiveProps() {
    this.setState({
      firstSymbol: null,
      lastSymbol: null,
      currentSymbol: null,
      leftCursorPos: 0,
      topCursorPos: 0,
      linesLastCursorPositions: []
    });
  }

  componentDidUpdate() {
    if (this.state.currentSymbol === null) {
      this.updateStateSymbols();
      this.cursor.classList.remove('hide');
      document.getElementsByClassName('stats')[0].classList.add('hide');
    }
  }

  updateStateSymbols() {
    const toPassSymbols = document.getElementsByClassName('topass');
    this.setState({ 
      firstSymbol: toPassSymbols[0],
      currentSymbol: toPassSymbols[0],
      lastSymbol: toPassSymbols[toPassSymbols.length - 1],
      currentSymbolNum: 0
    });
  }

  getNextSymbol() {
    return document.getElementsByClassName('char')[this.state.currentSymbolNum + 1];
  }

  getPrevSymbol() {
    return document.getElementsByClassName('char')[this.state.currentSymbolNum - 1];
  }

  // for simple keys
  handleWindowKeyPress(evt) {
    evt.preventDefault();
    
    const currentSymbol = this.state.currentSymbol;
    const typedSymbolCode = evt.which;
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

    // change classes
    currentSymbol.classList.remove('topass');
    if (typedSymbolCode === currentSymbolCode) {
      currentSymbol.classList.add('passed');
    } else {
      currentSymbol.classList.add('notpassed');
    }

    // if last symbol reached, hide cursor and show stats
    if (this.state.currentSymbol === this.state.lastSymbol) {
      this.cursor.classList.add('hide');
      document.getElementsByClassName('stats')[0].classList.remove('hide');
      window.scrollTo(0, document.body.scrollHeight);
      // TODO show congrats and little stats
      return;
    }

    // get next symbol and set it as current
    const next = this.getNextSymbol();
    this.setState({ currentSymbol: next });

    // moving the cursor to the next postition

    // when new line
    if (currentSymbolCode === 10 && typedSymbolCode === 13) {
      const linesLastCursorPositions = this.state.linesLastCursorPositions;
      linesLastCursorPositions.push(this.state.leftCursorPos);

      this.setState({ 
        leftCursorPos: 0,
        topCursorPos: this.state.topCursorPos + 18,
        linesLastCursorPositions,
        currentSymbolNum: this.state.currentSymbolNum + 1
      });
      return;
    }

    // when tab symbol reached
    if (currentSymbolCode === 9) {
      this.setState({ 
        leftCursorPos: this.state.leftCursorPos + currentSymbol.offsetWidth,
        currentSymbolNum: this.state.currentSymbolNum + 1
      });
      return;
    }

    // when the same line
    this.setState({ 
      leftCursorPos: this.state.leftCursorPos + currentSymbol.offsetWidth,
      currentSymbolNum: this.state.currentSymbolNum + 1 
    });
  }

  // for backspace and tab
  handleWindowKeyDown(evt) {
    // moving the cursor further if 'tab' key pressed
    if (evt.which === 9) {
      evt.preventDefault();

      const currentSymbol = this.state.currentSymbol;
      const currentSymbolCode = currentSymbol.innerText.charCodeAt(0);

      // if tab is a tab as a character
      if (currentSymbolCode === 9) {
        this.handleWindowKeyPress(evt);
      }

      // if tab is consist of spaces
      if (currentSymbolCode === 32) {
        // to count all next spaces
        let counter = 0;
        let summToAdd = 0;
        let currentEl = currentSymbol;

        // calculating the distance to move the cursor and changing classes of passed spaces
        while (currentEl.innerText.charCodeAt(0) === 32) {
          summToAdd += currentEl.offsetWidth;
          currentEl.classList.remove('topass');
          currentEl.classList.add('passed');
          currentEl = currentEl.nextElementSibling;
          counter++;
        }

        if (counter === 1) {
          // TODO change cursor to red then back to green
          // single spaces just for space
        } else {
          // move cursor through spaces ;)
          // TODO fix this double setState
          this.setState({
            currentSymbolNum: this.state.currentSymbolNum + (counter - 1)
          });
          this.setState({
            leftCursorPos: this.state.leftCursorPos + summToAdd,
            currentSymbol: this.getNextSymbol(),
            currentSymbolNum: this.state.currentSymbolNum + 1
          });
        }
      }
    }

    // moving the cursor back if 'backspace' key pressed
    if (evt.which === 8) {
      // the first element reached
      if (this.state.currentSymbol === this.state.firstSymbol) {
        // TODO change cursor to red then back to green
        return;
      }

      const currentSymbol = this.getPrevSymbol();
      const currentSymbolCode = currentSymbol.innerText.charCodeAt(0);

      this.setState({ currentSymbol });

      currentSymbol.classList.remove('notpassed');
      currentSymbol.classList.add('topass');

      // go to the previous line
      if (currentSymbolCode === 10) {
        const linesLastCursorPositions = this.state.linesLastCursorPositions;
        this.setState({
          leftCursorPos: linesLastCursorPositions.pop(),
          topCursorPos: this.state.topCursorPos - 18,
          linesLastCursorPositions,
          currentSymbolNum: this.state.currentSymbolNum - 1 
        });
        return;
      }

      // when the same line
      this.setState({ 
        leftCursorPos: this.state.leftCursorPos - currentSymbol.offsetWidth,
        currentSymbolNum: this.state.currentSymbolNum - 1
      });
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