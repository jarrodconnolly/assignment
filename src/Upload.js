import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

export default class Upload extends Component {
  render() {
    const onDrop = this.props.onDrop;
    let dropzoneRef;
    return (
      <div>

        <div className="btn-group mr-2">
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => { dropzoneRef.open() }}>
            Upload Data...
          </button>
        </div>
        <Dropzone id="dropzone" onDrop={onDrop} ref={(node) => { dropzoneRef = node; }}>
          <p>Try dropping some files here, or click to select files to upload.</p>
        </Dropzone>
      </div>
    );
  }
}
