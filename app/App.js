import React, { Component } from 'react';
import { render } from 'react-dom';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';

import Code from './Code';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '// code sample\n\nvar days = 28;\nvar summ = 100;\n\nconsole.log(days * summ);'
      // code: '<!DOCTYPE html>\n<html lang="en">\n</html>'
      // code: '// start typing\n// or\n// load own file\n\nconst date = new Date();\nconsole.log("Hello world!", date);\n\n// enjoy ;)'
      // code: 'while (true) {\n  // infinite loop\n}'

      // code: '',
    };

    this.handleChooseFile = this.handleChooseFile.bind(this);
    this.handleLoadFile = this.handleLoadFile.bind(this);
  }

  handleChooseFile() {
    this.fileInput.click();
  }

  handleLoadFile() {
    const file = this.fileInput.files[0];
    const fileReader = new FileReader();
    
    fileReader.readAsText(file);

    fileReader.onload = () => {
      // console.log(fileReader.result);
      this.setState({ 
        code: fileReader.result
      });
    };
  }

  highlightCode(code) {
    const highlightedCode = Prism.highlight(code, Prism.languages.javascript);
    const regexpTag = /(<\/?span.*?>)/;
    const tagsAndTextArr = highlightedCode.split(regexpTag);
    const regexpSpecialChar = /^&.*;$/;
    let codeToRender = '';

    // wrap code characters with <span class='topass'>
    for (let i = 0; i < tagsAndTextArr.length; i++) {
      // if text element wrap each symbol with span
      if (tagsAndTextArr[i] !== '' && !regexpTag.test(tagsAndTextArr[i])) {
        let newHtml = '';
        if (regexpSpecialChar.test(tagsAndTextArr[i])) {
          // special characters
          newHtml += `<span class="char topass">${tagsAndTextArr[i]}</span>`;
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
        <form style={{ textAlign: 'center' }}>
          <input 
            ref={element => this.fileInput = element} 
            onChange={this.handleLoadFile}
            type="file"
            className="file"
            id="file"
            hidden
          />
          <label className="load-file-button" htmlFor="file">LOAD FILE</label>
        </form>
        <br />
        <Code code={DOMPurify.sanitize(this.highlightCode(this.state.code))} />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));