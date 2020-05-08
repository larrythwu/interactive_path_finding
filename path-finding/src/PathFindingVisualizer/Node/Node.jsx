import React, { Component } from "react";

import "./node.css";

export default class Node extends Component {
  render() {
    const {
      col,
      row,
      isFinish,
      isStart,
      isWall,
      isVisited,
      shortestPath,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      moveStart,
      moveFinish,
    } = this.props;
    let extraClassName = moveStart
      ? "move-start"
      : moveFinish
      ? "move-finish"
      : isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : isWall
      ? "node-wall"
      : "";

    if (moveStart && isFinish) extraClassName = "node-finish";
    else if (moveFinish && isStart) extraClassName = "node-start";
    else if ((moveFinish || moveStart) && isWall) extraClassName = "node-wall";
    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}
