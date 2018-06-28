import React, { Component } from 'react';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

class DataChart extends Component {
  render() {
    return (
      <ResponsiveContainer width="100%" height={600}>
        <LineChart data={this.props.chartData}
                   margin={{ top: 5, right: 20, left: 20, bottom: 35 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" />
          <YAxis label="Rank"/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Google" stroke="blue" />
          <Line type="monotone" dataKey="Google Base Rank" stroke="green" />
          <Line type="monotone" dataKey="Bing" stroke="red" />
          <Line type="monotone" dataKey="Yahoo" stroke="purple" />
        </LineChart>
      </ResponsiveContainer>
    )
  }

}

export default DataChart;
