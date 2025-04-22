import React, { useState } from "react";
import { NODE_SIZE } from "./Maze";
import { Tooltip } from "@mui/material";

const Node = ({
	row,
	col,
	isVisited,
	isStartNode,
	isFinishNode,
	isWall,
	onMouseDown,
	onMouseEnter,
	onMouseUp,
}) => {
	// console.log(gridElement.current.parentElement);

	const className = `maze__node ${
		isStartNode === true ? "maze__start_node" : ""
	} ${isFinishNode === true ? "maze__finish_node" : ""} ${
		isVisited === true ? "maze__visited_node" : ""
	} 
				`;
	return (
		<div
			onAnimationEnd={(e) => {
				if (e.target.style.backgroundColor == "rgb(102, 26, 26)") {
					e.target.style.backgroundColor = "rgb(102, 26, 26)";
				}
			}}
			id={`node-${row}-${col}`}
			className={className}
			style={{
				width: `${NODE_SIZE}px`,
				height: `${NODE_SIZE}px`,
			}}
			onMouseDown={() => onMouseDown(row, col)}
			onMouseEnter={() => onMouseEnter(row, col, isWall)}
			onMouseUp={() => onMouseUp(row, col, isWall)}></div>
	);
};

export default Node;
