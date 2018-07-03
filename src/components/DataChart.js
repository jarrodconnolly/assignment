import React, { Component } from 'react'

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts'

const toPercent = (decimal, fixed = 0) => {
  return `${(decimal * 100).toFixed(fixed)}%`
}

class DataChart extends Component {

  selectTab = (tabName) => {
    document.getElementById('chartLine').className = 'hidden';
    document.getElementById('chartBar').className = 'hidden';
    document.getElementById('chartArea').className = 'hidden';

    document.getElementById('linkArea').className = 'nav-link';
    document.getElementById('linkBar').className = 'nav-link';
    document.getElementById('linkLine').className = 'nav-link';

    switch(tabName) {
      case 'area':
      {
        document.getElementById('chartArea').className = '';
        document.getElementById('linkArea').className = 'nav-link active';
        break;
      }
      case 'bar':
      {
        document.getElementById('chartBar').className = '';
        document.getElementById('linkBar').className = 'nav-link active';
        break;
      }
      case 'line':
      {
        document.getElementById('chartLine').className = '';
        document.getElementById('linkLine').className = 'nav-link active';
        break;
      }
      default:
        break;
    }
    this.props.processChartData();
  }

  render () {
    return (
      <div>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a id="linkArea" className="nav-link active" onClick={() => this.selectTab('area')}>Area</a>
          </li>
          <li className="nav-item">
            <a id="linkBar" className="nav-link" onClick={() => this.selectTab('bar')}>Bar</a>
          </li>
          <li className="nav-item">
            <a id="linkLine" className="nav-link" onClick={() => this.selectTab('line')}>Line</a>
          </li>
        </ul>
        <div id="chartLine" className={"hidden"}>
            <ResponsiveContainer width="100%" height={600}>
              <LineChart data={this.props.chartData}
                         margin={{ top: 5, right: 20, left: 20, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis label="Rank" width={100}/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Google" stroke="blue" />
                <Line type="monotone" dataKey="Google Base Rank" stroke="green" />
                <Line type="monotone" dataKey="Bing" stroke="red" />
                <Line type="monotone" dataKey="Yahoo" stroke="purple" />
              </LineChart>
            </ResponsiveContainer>
        </div>
        <div id="chartBar" className={"hidden"}>
            <ResponsiveContainer width="100%" height={600}>
              <BarChart data={this.props.chartData}
                        margin={{top: 5, right: 20, left: 20, bottom: 35}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="Date"/>
                <YAxis label="Rank" width={100}/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="Google" fill="blue"/>
                <Bar dataKey="Google Base Rank" fill="green"/>
                <Bar dataKey="Bing" fill="red"/>
                <Bar dataKey="Yahoo" fill="purple"/>
              </BarChart>
            </ResponsiveContainer>
        </div>
        <div id="chartArea">
            <ResponsiveContainer width="100%" height={600}>
              <AreaChart data={this.props.chartData} stackOffset="expand"
                         margin={{ top: 5, right: 20, left: 20, bottom: 35 }} >
                <XAxis dataKey="Date"/>
                <YAxis tickFormatter={toPercent}/>
                <Tooltip />
                <Area type='monotone' dataKey='Google' stackId="1" stroke='#8884d8' fill='#8884d8' />
                <Area type='monotone' dataKey='Google Base Rank' stackId="1" stroke='#82ca9d' fill='#82ca9d' />
                <Area type='monotone' dataKey='Bing' stackId="1" stroke='#ffc658' fill='#ffc658' />
                <Area type='monotone' dataKey='Yahoo' stackId="1" stroke='#aac628' fill='#aac628' />
              </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    )
  }

}

export default DataChart
