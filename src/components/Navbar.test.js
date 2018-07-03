import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './Navbar';
import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Navbar />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('render matches snapshot', () => {
  const tree = renderer
    .create(<Navbar />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
