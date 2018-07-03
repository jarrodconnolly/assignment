import React, { Component } from 'react';
import './App.css';
import Upload from './components/Upload';
import DataChart from './components/DataChart';
import ReactDataGrid from 'react-data-grid';
import Navbar from './components/Navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'open-iconic/font/css/open-iconic-bootstrap.min.css';
import moment from 'moment';

class App extends Component {
  constructor () {
    super()
    this.state = {
      rawData: [], // original raw data
      chartData: [], // processed/filtered data to display
      keywords: [], // unique keyword list
      selectedIndexes: [], // used by datagrid for row selection
      selectedKeyword: '', // currently selected keyword
      startDate: moment(), // filter start date
      endDate: moment(), // filter end date
    }
  }

  // callback function passed to Upload component
  // to update required state
  updateUploadedData = (rawData, uniqueKeywords) => {

    // find the min and max dates in our data
    // to restrict the date filters
    let minDate = moment(rawData[0].Date);
    let maxDate = moment(rawData[0].Date);

    rawData.forEach((row) => {
      const rowDate = moment(row.Date);
      if(rowDate.isAfter(maxDate)) {
        maxDate = moment(rowDate);
      }
      if(rowDate.isBefore(minDate)) {
        minDate = moment(rowDate);
      }
    });

    // the min/max and initial start/end filter dates
    this.setState(() => {
      return {
        minDate: minDate,
        maxDate: maxDate,
        startDate: minDate,
        endDate: maxDate,
      }
    })

    // set the data for display
    this.setState({
      rawData: rawData,
      keywords: uniqueKeywords,
    }, () => {
      this.handleGridSort("Searches", "DESC");
    })
  }

  // data grid sort handler
  handleGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1
      }
    }

    const rows = sortDirection === 'NONE'
      ? this.state.keywords.slice(0)
      : this.state.keywords.sort(comparer)

    this.setState({keywords: rows})
  }

  // data grid data provider method
  rowGetter = (i) => {
    return this.state.keywords[i]
  }

  // data grid row selection handler
  onRowsSelected = (rows) => {
    const selectedRowIndex = rows[0].rowIdx
    const selectedKeyword = rows[0].row
      ? rows[0].row.Keyword
      : ''

    this.setState(() => {
      return {
        selectedIndexes: [selectedRowIndex],
      }
    })

    console.log(`Selected Keyword: ${selectedKeyword}`)

    this.setState({selectedKeyword:selectedKeyword}, () => {
      this.processChartData();
    })

  }

  // filter the chart data
  // by keyword
  // by filter dates
  processChartData = () => {
    const chartData = this.state.rawData
      .filter((row) => {
        return row.Keyword === this.state.selectedKeyword;
      })
      .filter((row) => {
        const rowDate = moment(row.Date);
        return rowDate.isSameOrAfter(this.state.startDate)
          && rowDate.isSameOrBefore(this.state.endDate);
      });

    this.setState(() => {
      return {
        chartData: chartData,
      }
    })
  }

  // data grid event
  onRowsDeselected = () => {
    this.setState({selectedIndexes: []})
  }

  // data grid event
  onRowClick = (rowId, row) => {
    this.onRowsSelected([{row: row, rowIdx: rowId}])
  }

  // filter start date event
  handleChangeStart = (date) => {
    this.setState({startDate: date}, () => {
      this.processChartData();
    })
  }

  // filter end date event
  handleChangeEnd = (date) => {
    this.setState({endDate: date}, () => {
      this.processChartData();
    })
  }

  // main render function
  render () {

    const columns = [
      {
        key: 'Keyword',
        name: 'Search Keyword',
        sortable: true,
        resizable: true
      },
      {
        key: 'Searches',
        name: 'Global Monthly Searches',
        sortable: true,
        resizable: true
      }]

    return (
      <div>

        <Navbar />

        <div className="container-fluid">
          <div className="row">
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
              <div className="sidebar-sticky">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <a className="nav-link active">
                      <span className="oi oi-home" title="Home" aria-hidden="true"/>
                      Dashboard
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span className="oi oi-book" title="Documents" aria-hidden="true"/>
                      Documents
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span className="oi oi-person" title="Profile" aria-hidden="true"/>
                      Profile
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span className="oi oi-beaker" title="Lab" aria-hidden="true"/>
                      Lab
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      <span className="oi oi-cog" title="Settings" aria-hidden="true"/>
                      Settings
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
            <div className="card">
              <div className="card-header">
                Data Chart
              </div>
              <div className="card-body">
                <DataChart chartData={this.state.chartData} processChartData={this.processChartData}/>
              </div>
            </div>
          </div>

          <div className="container-fluid" style={{marginTop:20}}>
            <div className="card">
              <div className="card-header">
                Filters
              </div>
              <div className="card-body">
                <form>

                  <div className="form-group row">
                    <label htmlFor="dateStart" className="col-sm-2 col-form-label">Start Date</label>
                    <div className="col-sm-10">
                      <DatePicker
                        className={"form-control"}
                        id="dateStart"
                        dateFormat="YYYY-MM-DD"
                        selected={this.state.startDate}
                        selectsStart
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        minDate={this.state.minDate}
                        maxDate={this.state.maxDate}
                        onChange={this.handleChangeStart}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label htmlFor="dateEnd" className="col-sm-2 col-form-label">End Date</label>
                    <div className="col-sm-10">
                      <DatePicker
                        className={"form-control"}
                        id="dateEnd"
                        dateFormat="YYYY-MM-DD"
                        selected={this.state.endDate}
                        selectsEnd
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        minDate={this.state.minDate}
                        maxDate={this.state.maxDate}
                        onChange={this.handleChangeEnd}
                      />
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </div>

          <div className="container-fluid" style={{marginTop:20}}>
            <div className="card">
              <div className="card-header">
                Select Keyword
              </div>
              <div className="card-body">
                <div className="container-fluid">
                <ReactDataGrid
                  sortColumn={"Searches"}
                  sortDirection={"DESC"}
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
                      indexes: this.state.selectedIndexes,
                    },
                  }}
                />
                </div>
              </div>
            </div>
          </div>

        </main>


      </div>
    )
  }
}

export default App
