import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse'

export default class Upload extends Component {

  onDrop = (acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = Papa.parse(reader.result,
          {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
          });

        this.processUploadData(result.data);
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsText(file);
    });
  }

  processUploadData = (data) => {

    console.log(data);

    let maxGlobalMonthlySearches = 0;
    const keywords = new Set();
    const keywordData = [];

    // iterate the data once to find:
    //   unique keywords
    //   max global monthly searches
    data.forEach((row) => {
      // add new keyword to our list if we do not already have it
      // this is for the keyword selection list
      if(!keywords.has(row.Keyword)) {
        keywords.add(row.Keyword);
        keywordData.push({
          Keyword:row.Keyword,
          Searches:parseInt(row["Global Monthly Searches"], 10)
        })
      }

      // find the maxGlobalMonthlySearches
      if(row["Global Monthly Searches"] > maxGlobalMonthlySearches) {
        maxGlobalMonthlySearches = row["Global Monthly Searches"];
      }

    });

    // populate the data for the weighted graphs
    data.forEach((row) => {
      row["Google-weighted"] = row["Google"] * (row["Global Monthly Searches"] / maxGlobalMonthlySearches);
      row["Google Base Rank-weighted"] = row["Google Base Rank"] * (row["Global Monthly Searches"] / maxGlobalMonthlySearches);
      row["Bing-weighted"] = row["Bing"] * (row["Global Monthly Searches"] / maxGlobalMonthlySearches);
      row["Yahoo-weighted"] = row["Yahoo"] * (row["Global Monthly Searches"] / maxGlobalMonthlySearches);
    });

    console.log(keywords)

    this.props.updateUploadedData(data, keywordData, maxGlobalMonthlySearches);
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
