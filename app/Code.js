import React, { Component } from 'react';
import DOMPurify from 'dompurify'
import Prism from 'prismjs';

class Code extends Component {
  componentDidMount() {
    hljs.highlightBlock(document.getElementById('codeBlock'));
  }

  componentDidUpdate() {
    hljs.highlightBlock(document.getElementById('codeBlock'));
  }

  render() {
    // var highlightedCode = Prism.highlight(this.props.code, Prism.languages.javascript);
    // return <pre dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(highlightedCode)}}></pre>
    
    return <pre><code id="codeBlock" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.props.code)}}></code></pre>
  }
}

export default Code;