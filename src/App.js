import React, { Component } from 'react';
import './App.css';
import Upload from './Upload';
import Papa from 'papaparse';

class App extends Component {

  constructor() {
    super()
    this.onDrop = this.onDrop.bind(this);
  }

  // remove utf-16 bom in source data file
  stripBom(input) {
    if (input.charCodeAt(0) === 0xFF && input.charCodeAt(1) === 0xFE) {
      return input.slice(2);
    } else {
      return input;
    }
  }

  onDrop(acceptedFiles) {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileAsBinaryString = this.stripBom(reader.result);
        const data = Papa.parse(fileAsBinaryString,
          {
            header: true,
            skipEmptyLines: true
          });
        console.log(data);
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
    });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Assignment</a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap">
              <a className="nav-link" href="#">Sign out</a>
            </li>
          </ul>
        </nav>

        <div className="container-fluid">
          <div className="row">
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
              <div className="sidebar-sticky">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <a className="nav-link active" href="#">
                      <span data-feather="home"></span>
                      Dashboard <span className="sr-only">(current)</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <span data-feather="file"></span>
                      Other
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <span data-feather="shopping-cart"></span>
                      Menu
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <span data-feather="users"></span>
                      Items
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>

        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
          <div
            className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <Upload onDrop={this.onDrop}/>
            </div>
          </div>
        </main>

      </div>
    );
  }
}

export default App;
