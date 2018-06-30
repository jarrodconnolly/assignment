import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse'

export default class Upload extends Component {

  // remove utf-16 bom in source data file
  stripBom = (input) => {
    if (input.charCodeAt(0) === 0xFF && input.charCodeAt(1) === 0xFE) {
      return input.slice(2);
    } else {
      return input;
    }
  }

  onDrop = (acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileAsBinaryString = this.stripBom(reader.result);
        const result = Papa.parse(fileAsBinaryString,
          {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
          });

        this.processUploadData(result.data);
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
    });
  }

  processUploadData = (data) => {

    console.log(data);

    // unique keywords
    const keywords = new Set();
    const keywordData = [];
    data.forEach((row) => {
      if(!keywords.has(row.Keyword)) {
        keywords.add(row.Keyword);
        keywordData.push({
          Keyword:row.Keyword,
          Searches:parseInt(row["Global Monthly Searches"], 10)
        })
      }
    });

    console.log(keywords)

    this.props.updateUploadedData(data, keywordData);
  }


  render() {
    let dropzoneRef;
    return (
      <div>

        <div className="btn-group mr-2">
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => { dropzoneRef.open() }}>
            Upload Data...
          </button>
        </div>
        <Dropzone id="dropzone" onDrop={this.onDrop} ref={(node) => { dropzoneRef = node; }}>
          <p>Try dropping some files here, or click to select files to upload.</p>
        </Dropzone>
      </div>
    );
  }
}
