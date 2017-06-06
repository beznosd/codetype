import React, { Component } from 'react';
import { render } from 'react-dom';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';

import Code from './Code';

class App extends Component {
  constructor(props) {
    super(props);
    
    // localStorage.setItem('code', '');
    const defaultCode = '// start typing\n// or\n// load own file\n\nconst date = new Date();\nconsole.log("Hello world!", date);\n\n// you\'re welcome to create an issue on github if you found a bug';
    const code = localStorage.getItem('code') || defaultCode;

    this.state = {
      code
    };

    this.handleChooseFile = this.handleChooseFile.bind(this);
    this.handleLoadFile = this.handleLoadFile.bind(this);
  }

  handleChooseFile(evt) {
    evt.preventDefault();
    this.fileInput.click();
  }

  handleLoadFile() {
    const file = this.fileInput.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsText(file);

    fileReader.onload = () => {
      localStorage.setItem('code', fileReader.result);

      this.setState({ 
        code: fileReader.result
      });
    };
  }

  // TODO improve function, stucks on regexps in js
  highlightCode(code) {
    const highlightedCode = Prism.highlight(code, Prism.languages.javascript);
    const regexpTag = /(<\/?span.*?>)/;
    const tagsAndTextArr = highlightedCode.split(regexpTag);
    const regexpSpecialChar = /&[a-z]*;/;
    let codeToRender = '';

    // wrap code characters with <span class='topass'>
    for (let i = 0; i < tagsAndTextArr.length; i++) {
      // if text element wrap each symbol with span
      if (tagsAndTextArr[i] !== '' && !regexpTag.test(tagsAndTextArr[i])) {
        let newHtml = '';
        if (regexpSpecialChar.test(tagsAndTextArr[i])) {
          // console.log(tagsAndTextArr[i]);
          // special characters
          const specialCharsArr = tagsAndTextArr[i].match(/&[a-z]*;/g);
          // if we have one special character without other symbols
          if (specialCharsArr.length === 1 && specialCharsArr[0] === tagsAndTextArr[i]) {
            newHtml += `<span class="char topass">${tagsAndTextArr[i]}</span>`;
          // if we have special character with other symbols
          } else {
            const otherCharsArr = tagsAndTextArr[i].split(regexpSpecialChar);
            // console.log(otherCharsArr);
            for (let j = 0; j < otherCharsArr.length; j++) {
              if (otherCharsArr[j] === '' && j < specialCharsArr.length) {
                newHtml += `<span class="char topass">${specialCharsArr[0]}</span>`;
                continue;
              }
              for (let k = 0; k < otherCharsArr[j].length; k++) {
                newHtml += `<span class="char topass">${otherCharsArr[j][k]}</span>`;
              }
              if (j !== otherCharsArr.length - 1) {
                newHtml += `<span class="char topass">${specialCharsArr[0]}</span>`;
              }
            }
          }
        } else {
          // simple words and symbols
          for (let j = 0; j < tagsAndTextArr[i].length; j++) {
            newHtml += `<span class="char topass">${tagsAndTextArr[i][j]}</span>`;
          }
        }
        tagsAndTextArr[i] = newHtml;
      }
      codeToRender += tagsAndTextArr[i];
    }

    return codeToRender;
  }

  render() {
    return (
      <div>
        <form>
          <input 
            ref={element => this.fileInput = element} 
            onChange={this.handleLoadFile}
            type="file"
            className="file"
            id="file"
            hidden
          />
          <label className="button" htmlFor="file">Load file</label>
        </form>
        <br />
        <Code code={DOMPurify.sanitize(this.highlightCode(this.state.code))} />
        <div className="stats hide">
          <form>
            <a className="button" href="https://beznosd.github.io/codetype/">Start again &#8634;</a>
            <span className="or">or</span>
            <button onClick={this.handleChooseFile} className="button">Load new file</button>
          </form>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));