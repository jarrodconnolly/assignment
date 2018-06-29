import React, { Component } from 'react';
import './App.css';
import Upload from './Upload';
import DataChart from './DataChart';
import ReactDataGrid from 'react-data-grid';

class App extends Component {
  constructor() {
    super();
    this.state = {
      rawData:[],
      chartData:[],
      keywords:[],
      selectedIndexes:[]
    };
  }

  // callback function passed to Upload component
  // to update required state
  updateUploadedData = (rawData, uniqueKeywords) => {
    this.setState({
      rawData:rawData,
      keywords:uniqueKeywords
    });
  }

  // data grid sort handler
  handleGridSort = (sortColumn, sortDirection) => {
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

  // data grid data provider method
  rowGetter = (i) => {
    return this.state.keywords[i];
  };

  // data grid row selection handler
  onRowsSelected = (rows) => {
    const selectedRowIndex = rows[0].rowIdx;
    const selectedKeyword = rows[0].row
      ? rows[0].row.Keyword
      : '';

    this.setState(() => {
      return {
        selectedIndexes: [selectedRowIndex]
      }
    });

    console.log(`Selected Keyword: ${selectedKeyword}`)

    this.processChartData(selectedKeyword);
  };

  processChartData = (selectedKeyword) => {

    const chartData = this.state.rawData
      .filter((row) => {
        return row.Keyword === selectedKeyword;
      });

    this.setState(() => {
      return {chartData:chartData}
    });
  }

  onRowsDeselected = () => {
    this.setState({selectedIndexes:[]});
  };

  onRowClick = (rowId,row) => {
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
              <Upload updateUploadedData={this.updateUploadedData}/>
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
