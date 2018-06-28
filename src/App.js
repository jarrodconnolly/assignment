import React, { Component } from 'react';
import './App.css';
import Upload from './Upload';
import Papa from 'papaparse';
import DataChart from './DataChart';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import ReactDataGrid from 'react-data-grid';


class App extends Component {

  constructor() {
    super()
    this.onDrop = this.onDrop.bind(this);
    this.rowGetter = this.rowGetter.bind(this);
    this.handleGridSort = this.handleGridSort.bind(this);
    this.onRowsSelected = this.onRowsSelected.bind(this);
    this.onRowsDeselected = this.onRowsDeselected.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.processChartData = this.processChartData.bind(this);
    this.matchesSelectedKeyword = this.matchesSelectedKeyword.bind(this);
    this.state = {
      rawData:[],
      chartData:[],
      keywords:[],
      selectedIndexes:[],
      selectedKeyword: ''
    };
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

  processUploadData(data) {

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

    this.setState({
      rawData:data,
      keywords:keywordData
    });
  }

  handleGridSort(sortColumn, sortDirection) {

    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    };


    const rows = sortDirection === 'NONE'
      ? this.state.keywords.slice(0)
      : this.state.keywords.sort(comparer);

    this.setState({ keywords: rows });
  };

  rowGetter(i) {
    return this.state.keywords[i];
  };

  onRowsSelected(rows) {
    const selectedRowIndex = rows[0].rowIdx;
    const selectedKeyword = rows[0].row
      ? rows[0].row.Keyword
      : '';
    this.setState({
      selectedIndexes: [selectedRowIndex],
      selectedKeyword: selectedKeyword
    });
    console.log(`Selected Keyword: ${selectedKeyword}`)

    this.processChartData();
  };

  matchesSelectedKeyword(row) {
    return row.Keyword === this.state.selectedKeyword;
  }

  processChartData() {

    const chartData = this.state.rawData
      .filter(this.matchesSelectedKeyword);

    this.setState({chartData:chartData});
  }

  onRowsDeselected = () => {
    this.setState({selectedIndexes:[]});
  };

  onRowClick(rowId,row) {
    this.onRowsSelected([{row:row,rowIdx:rowId}]);
  }

  render() {

    const columns = [
      {
        key: 'Keyword',
        name: 'Search Keyword',
        sortable: true
      },
      {
        key: 'Searches',
        name: 'Global Monthly Searches',
        sortable: true
      }];

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

          <div className="container-fluid">
            <DataChart chartData={this.state.chartData}/>
          </div>

          <div className="container-fluid">
            <ReactDataGrid
              onRowClick={this.onRowClick}
              onGridSort={this.handleGridSort}
              columns={columns}
              rowGetter={this.rowGetter}
              rowsCount={this.state.keywords.length}
              minHeight={300}
              rowSelection={{
                showCheckbox: false,
                enableShiftSelect: false,
                onRowsSelected: this.onRowsSelected,
                onRowsDeselected: this.onRowsDeselected,
                selectBy: {
                  indexes: this.state.selectedIndexes
                }
              }}
            />
          </div>

        </main>


      </div>
    );
  }
}

export default App;
