import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import "./PathFindingVisualizer.css";
import { Button } from "../components/Button.jsx";

let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;
let moveStart = false;
let moveFinish = false;

export default class PathFindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const newGrid = getInitialGrid();
    this.setState({ grid: newGrid, mouseIsPressed: false });
  }

  isStartFinish(row, col) {
    return (
      (row === START_NODE_ROW && col === START_NODE_COL) ||
      (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)
    );
  }

  handleMouseDown(row, col) {
    this.clearGrid();
    if (!moveStart && !moveFinish) {
      moveStart = row === START_NODE_ROW && col === START_NODE_COL;
      moveFinish = row === FINISH_NODE_ROW && col === FINISH_NODE_COL;
    } else {
      if (moveStart) {
        this.state.grid[START_NODE_ROW][START_NODE_COL].isStart = false;
        this.state.grid[row][col].isStart = true;
        this.state.grid[row][col].isWall = false;
        START_NODE_ROW = row;
        START_NODE_COL = col;
        moveStart = false;
      } else if (moveFinish) {
        this.state.grid[FINISH_NODE_ROW][FINISH_NODE_COL].isFinish = false;
        this.state.grid[row][col].isFinish = true;
        this.state.grid[row][col].isWall = false;
        FINISH_NODE_ROW = row;
        FINISH_NODE_COL = col;
        moveFinish = false;
      }
    }
    let newGrid = this.state.grid;

    if (!this.isStartFinish(row, col))
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col);

    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      const node = visitedNodesInOrder[i];
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 2 * i);
        return;
      }
      if (!node.isStart && !node.isFinish) {
        setTimeout(() => {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }, 2 * i);
      }
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      const node = nodesInShortestPathOrder[i];
      if (!node.isStart && !node.isFinish) {
        setTimeout(() => {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }, 20 * i);
      }
    }
  }

  visualizeDijkstra() {
    this.clearGrid();
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  resetGrid() {
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 50; col++) {
        if (row === START_NODE_ROW && col === START_NODE_COL)
          document.getElementById(`node-${row}-${col}`).className =
            "node node-start";
        else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)
          document.getElementById(`node-${row}-${col}`).className =
            "node node-finish";
        else document.getElementById(`node-${row}-${col}`).className = "node";
      }
    }
    this.setState({ grid: getInitialGrid() });
  }

  //clear everthing except the walls
  clearGrid() {
    const grid = this.state.grid;
    let newGrid = getInitialGrid();

    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 50; col++) {
        if (row === START_NODE_ROW && col === START_NODE_COL)
          document.getElementById(`node-${row}-${col}`).className =
            "node node-start";
        else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)
          document.getElementById(`node-${row}-${col}`).className =
            "node node-finish";
        else if (!grid[row][col].isWall)
          document.getElementById(`node-${row}-${col}`).className = "node";

        newGrid[row][col].isWall = grid[row][col].isWall;
      }
    }
    this.setState({ grid: newGrid });
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      row={row}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      moveStart={moveStart}
                      moveFinish={moveFinish}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
        <Button
          onClick={() => this.visualizeDijkstra()}
          type="button"
          buttonStyle="btn--success--solid"
          buttonSize="btn--medium"
        >
          Find Path
        </Button>

        <Button
          onClick={() => this.resetGrid()}
          type="button"
          buttonStyle="btn--primary--solid"
          buttonSize="btn--medium"
        >
          Clear
        </Button>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  //get window size here
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isWall: false,
    previousNode: null, //parent ?
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  node.isWall = !node.isWall;
  newGrid[row][col] = node;
  return newGrid;
};
