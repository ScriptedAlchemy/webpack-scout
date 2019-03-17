import React, { Component } from 'react';

const Test = () => {
  return (
    <button onClick={() => dispatch({
      type: 'fake',
      payload: 'nothin'
    })}>test</button>
  );
};

class TestTwo extends Component {
  render() {
    return (
      <button onClick={() => dispatch({
        type: 'fake',
        payload: 'nothin'
      })}>test</button>
    );
  }
};

const TestThree = () => (
  <button onClick={() => dispatch({
    type: 'fake',
    payload: 'nothin'
  })}>test</button>
);


export { TestTwo, Test, TestThree };
