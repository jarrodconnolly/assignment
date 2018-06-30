import React, { Component } from 'react'
import './App.css'
import Upload from './Upload'
import DataChart from './DataChart'
import ReactDataGrid from 'react-data-grid'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

class App extends Component {
  constructor () {
    super()
    this.state = {
      rawData: [],
      chartData: [],
      keywords: [],
      selectedIndexes: [],
      selectedKeyword: '',
      startDate: moment('2016-02-01'),
      endDate: moment('2016-02-15'),
    }
  }

  // callback function passed to Upload component
  // to update required state
  updateUploadedData = (rawData, uniqueKeywords) => {
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

  processChartData = () => {

    const chartData = this.state.rawData
      .filter((row) => {
        return row.Keyword === this.state.selectedKeyword;
      })
      .filter((row) => {
        return moment(row.Date).isSameOrAfter(this.state.startDate)
          && moment(row.Date).isSameOrBefore(this.state.endDate);
      });

    this.setState(() => {
      return {chartData: chartData}
    })
  }

  onRowsDeselected = () => {
    this.setState({selectedIndexes: []})
  }

  onRowClick = (rowId, row) => {
    this.onRowsSelected([{row: row, rowIdx: rowId}])
  }

  handleChangeStart = (date) => {
    this.setState({startDate: date}, () => {
      this.processChartData();
    })
  }

  handleChangeEnd = (date) => {
    this.setState({endDate: date}, () => {
      this.processChartData();
    })
  }

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
            <div className="card">
              <div className="card-header">
                Data Chart
              </div>
              <div className="card-body">
                <DataChart chartData={this.state.chartData}/>
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
                  <div className="row">
                    <div className="form-group col-md-2">
                      <label htmlFor="dateStart">Start Date</label>
                      <DatePicker
                        id="dateStart"
                        dateFormat="YYYY-MM-DD"
                        selected={this.state.startDate}
                        selectsStart
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onChange={this.handleChangeStart}
                      />
                    </div>
                    <div className="form-group col-md-2">
                      <label htmlFor="dateEnd">End Date</label>
                      <DatePicker
                        id="dateEnd"
                        dateFormat="YYYY-MM-DD"
                        selected={this.state.endDate}
                        selectsEnd
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
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
