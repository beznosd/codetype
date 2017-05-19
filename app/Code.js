import React, { Component } from 'react';
import DOMPurify from 'dompurify'
import Prism from 'prismjs';

class Code extends Component {
  render() {
    var highlightedCode = Prism.highlight(this.props.code, Prism.languages.javascript);
    return <pre dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(highlightedCode)}}></pre>
  }
}

export default Code;