// BUG: Wall Animation causes undesirable results
// BUG: Clicking in middle of an animation fisnishes that animation

import React, { useState, useEffect, useRef } from "react";
import Node from "./Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { bfs } from "../algorithms/bfs";
import { dfs } from "../algorithms/dfs";
import {
	Alert,
	Button,
	FormControlLabel,
	Radio,
	RadioGroup,
	Snackbar,
	Tooltip,
} from "@mui/material";
import SquareIcon from "@mui/icons-material/Square";

import "./maze.css";

export const NODE_SIZE = 30;
const VIEWPORT_WIDTH = window.innerWidth;
const VIEWPORT_HEIGHT = window.innerHeight;
const NUMBER_OF_COL = Math.floor((VIEWPORT_WIDTH - 2) / NODE_SIZE);
const NUMBER_OF_ROW = Math.floor((0.8 * VIEWPORT_HEIGHT - 2) / NODE_SIZE);

const WALL_CLR = "#00004d";
const CELL_CLR = "#d9d9d9";
const HURDLE_CLR = "#661a1a";

const FAST_ANIMATION_SPEED = 5;
const MEDIUM_ANIMATION_SPEED = 20;
const SLOW_ANIMATION_SPEED = 50;

const INITIAL_START_NODE_ROW = 10;
const INITIAL_START_NODE_COL = 5;
const INITIAL_FINISH_NODE_ROW = 2;
const INITIAL_FINISH_NODE_COL = 40;

const Maze = () => {
	const [grid, setGrid] = useState([]);
	const [startNodeRow, setStartNodeRow] = useState(INITIAL_START_NODE_ROW);
	const [startNodeCol, setStartNodeCol] = useState(INITIAL_START_NODE_COL);
	const [finishNodeRow, setFinishNodeRow] = useState(INITIAL_FINISH_NODE_ROW);
	const [finishNodeCol, setFinishNodeCol] = useState(INITIAL_FINISH_NODE_COL);
	const [startNode, setStartNode] = useState(null);
	const [finishNode, setFinishNode] = useState(null);
	const [mouseIsPressed, setMouseIsPressed] = useState(false);
	const [isDraggingStartNode, setIsDraggingStartNode] = useState(false);
	const [isDraggingFinishNode, setIsDraggingFinishNode] = useState(false);
	const [animationSpeed, setAnimationSpeed] = useState(FAST_ANIMATION_SPEED);
	const [obstacle, setObstacle] = useState("wall");
	const [showMessage, setShowMessage] = useState(false);
	const [message, setMessage] = useState("");

	const wallsIndex = useRef([]);
	const hurdlesIndex = useRef([]);
	const rootRef = useRef(null);
	const nodeRef = useRef(null);
	const animationRef = useRef(false);

	const handleAnimationSpeedChange = (e) => {
		setAnimationSpeed(e.target.value);
	};

	const handleMouseDown = (row, col) => {
		if (animationRef.current) {
			return;
		}
		setMouseIsPressed(true);
		if (row === startNodeRow && col === startNodeCol) {
			setIsDraggingStartNode(true);
			nodeRef.current = startNode;
			return;
		} else if (row === finishNodeRow && col === finishNodeCol) {
			setIsDraggingFinishNode(true);
			nodeRef.current = finishNode;
			return;
		} else {
			const newGrid = getNewGrid(
				rootRef,
				grid,
				row,
				col,
				wallsIndex,
				hurdlesIndex,
				obstacle
			);
			setGrid(newGrid);
		}
	};

	const handleMouseEnter = (row, col, isWall) => {
		if (!mouseIsPressed) {
			return;
		}
		if (row === startNodeRow && col === startNodeCol) {
			return;
		} else if (row === finishNodeRow && col === finishNodeCol) {
			return;
		} else if (isDraggingStartNode) {
			if (isWall) {
				setMessage("Can't put start node here");
			} else {
				toggleStartNode(rootRef, grid, row, col, nodeRef);
			}
			return;
		} else if (isDraggingFinishNode) {
			if (isWall) {
				setMessage("Can't put start node here");
			} else {
				toggleFinishNode(rootRef, grid, row, col, nodeRef);
			}
			return;
		} else {
			const newGrid = getNewGrid(
				rootRef,
				grid,
				row,
				col,
				wallsIndex,
				hurdlesIndex,
				obstacle
			);
			setGrid(newGrid);
		}
	};

	const handleMouseUp = (row, col, isWall) => {
		setMouseIsPressed(false);
		if (isDraggingFinishNode) {
			if (isWall) {
				setMessage("Can't put finish node here");
			} else {
				setFinishNodeRow(row);
				setFinishNodeCol(col);
				setFinishNode(nodeRef.current);
			}
			setIsDraggingFinishNode(false);
		} else if (isDraggingStartNode) {
			if (isWall) {
				setMessage("Can't put start node here");
			} else {
				setStartNodeRow(row);
				setStartNodeCol(col);
				setStartNode(nodeRef.current);
			}
			setIsDraggingStartNode(false);
		}
	};

	const visualizeUtility = (visitedNodesInOrder) => {
		for (let i = 0; i <= visitedNodesInOrder.length; i++) {
			if (i === visitedNodesInOrder.length) {
				setTimeout(() => {
					const pathNodes = getNodesInShortestPathOrder(finishNode);
					if (pathNodes[0] !== startNode) {
						setMessage("Can't Reach Target");
						return;
					}
					for (let j = 0; j <= pathNodes.length; j++) {
						if (j === pathNodes.length) {
							setTimeout(() => {
								// setInAnimation(false);
								animationRef.current = false;
							}, 120 * j);
							return;
						}
						const node = rootRef.current.querySelector(
							`#node-${pathNodes[j].row}-${pathNodes[j].col}`
						);
						setTimeout(() => {
							node.classList.add("maze__shortest_path_node");
						}, 120 * j);
					}
				}, animationSpeed * i);
				break;
			}
			setTimeout(() => {
				const node = rootRef.current.querySelector(
					`#node-${visitedNodesInOrder[i].row}-${visitedNodesInOrder[i].col}`
				);
				node.classList.add("maze__visited_node");
			}, animationSpeed * i);
		}
	};

	const visualizeDijkstra = () => {
		animationRef.current = true;
		if (grid.length === 0) {
			return;
		}
		const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
		visualizeUtility(visitedNodesInOrder);
	};

	const visualizeBfs = () => {
		if (grid.length === 0) {
			return;
		}

		const visitedNodesInOrder = bfs(grid, startNode, finishNode);
		visualizeUtility(visitedNodesInOrder);
	};

	const visualizeDfs = () => {
		if (grid.length === 0) {
			return;
		}

		const visitedNodesInOrder = dfs(grid, startNode, finishNode);
		visualizeUtility(visitedNodesInOrder);
	};

	const getInitialGrid = () => {
		setFinishNodeRow(INITIAL_FINISH_NODE_ROW);
		setFinishNodeCol(INITIAL_FINISH_NODE_COL);
		setStartNodeRow(INITIAL_START_NODE_ROW);
		setStartNodeCol(INITIAL_START_NODE_COL);
		setStartNode(null);
		setFinishNode(null);
		setAnimationSpeed(FAST_ANIMATION_SPEED);
		nodeRef.current = null;

		if (rootRef.current !== null && grid.length > 0) {
			const nodes = [...rootRef.current.querySelectorAll(".maze__node")];
			nodes.map((node) => {
				node.className = "maze__node";
			});
			const stNode = rootRef.current.querySelector(
				`#node-${INITIAL_START_NODE_ROW}-${INITIAL_START_NODE_COL}`
			);
			stNode.classList.add("maze__start_node");
			const finNode = rootRef.current.querySelector(
				`#node-${INITIAL_FINISH_NODE_ROW}-${INITIAL_FINISH_NODE_COL}`
			);
			finNode.classList.add("maze__finish_node");
			wallsIndex.current.map(({ row, col }) => {
				const wallNode = rootRef.current.querySelector(`#node-${row}-${col}`);
				wallNode.style.backgroundColor = CELL_CLR;
			});
			hurdlesIndex.current.map(({ row, col }) => {
				const hurdleNode = rootRef.current.querySelector(`#node-${row}-${col}`);
				hurdleNode.style.backgroundColor = CELL_CLR;
				hurdleNode.style.background = "";
			});
		}

		const gridElement = [];
		for (let i = 0; i < NUMBER_OF_ROW; i++) {
			const row = [];
			for (let j = 0; j < NUMBER_OF_COL; j++) {
				const node = {
					row: i,
					col: j,
					isVisited: false,
					isStartNode:
						i === INITIAL_START_NODE_ROW && j === INITIAL_START_NODE_COL,
					isFinishNode:
						i === INITIAL_FINISH_NODE_ROW && j === INITIAL_FINISH_NODE_COL,
					distance: Infinity,
					isWall: false,
					isHurdle: false,
					previousNode: null,
				};
				row.push(node);
				if (node.isFinishNode) {
					setFinishNode(node);
				}
				if (node.isStartNode) {
					setStartNode(node);
				}
			}
			gridElement.push(row);
		}
		setGrid(gridElement);
	};

	useEffect(() => {
		getInitialGrid();
	}, []);

	return (
		<div className="maze__top_container">
			<div className="maze__menu">
				<div className="italianno-regular maze__heading">Path Finder</div>
				<div>
					<div
						style={{
							width: "100%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							gap: "30px",
							marginBottom: "20px",
						}}>
						<Button
							onClick={() => {
								setObstacle("wall");
							}}
							variant="outlined"
							sx={{
								borderColor: obstacle === "wall" ? "#57c1b5" : "white",
								color: "white",
								width: "180px",
							}}>
							<SquareIcon
								sx={{
									color: WALL_CLR,
									width: "50px",
									height: "50px",
									marginRight: "20px",
								}}
							/>
							<div className="arvo-bold">Wall</div>
						</Button>
						{/* <Button
							onClick={() => {
								setObstacle("hurdle");
							}}
							variant="outlined"
							sx={{
								borderColor: obstacle === "wall" ? "white" : "#57c1b5",
								color: "white",
								width: "180px",
								display: "hidden"
							}}>
							<SquareIcon
								sx={{
									color: HURDLE_CLR,
									width: "50px",
									height: "50px",
									marginRight: "20px",
								}}
							/>
							<div className="arvo-bold">Hurdle</div>
						</Button> */}
					</div>
					<div className="maze__btn_container2">
						<Tooltip title="Best algorithm, Only Algorithm that deals with hurdles">
							<Button
								color="secondary"
								variant="outlined"
								onClick={() => {
									visualizeDijkstra();
								}}>
								<div className="arvo-bold">Dijkstra's Algorithm</div>
							</Button>
						</Tooltip>

						<Tooltip
							title="Terrible algorithm for path finding.
						DOES NOT GURANTEE SHORTEST PATH">
							<Button
								color="secondary"
								variant="outlined"
								onClick={() => {
									visualizeDfs();
								}}>
								<div className="arvo-bold">Depth First Search</div>
							</Button>
						</Tooltip>

						<Tooltip title="Gives shortest path but doesn't work with hurdles">
							<Button
								color="secondary"
								variant="outlined"
								onClick={() => {
									visualizeBfs();
								}}>
								<div className="arvo-bold">Breadth First Search</div>
							</Button>
						</Tooltip>
					</div>
				</div>
				<div className="maze__btn_container1">
					<div>
						<div
							className="arvo-bold-italic"
							style={{
								fontSize: "1.2em",
								textAlign: "center",
							}}>
							Animation Speed
						</div>
						<RadioGroup
							aria-labelledby="Animation Speed Controller"
							name="animation-speed-controller"
							value={animationSpeed}
							onChange={handleAnimationSpeedChange}
							row>
							<FormControlLabel
								value={FAST_ANIMATION_SPEED}
								control={
									<Radio
										color="secondary"
										sx={{
											color: "white",
										}}
									/>
								}
								label={<span className="arvo-regular-italic">Fast</span>}
							/>
							<FormControlLabel
								value={MEDIUM_ANIMATION_SPEED}
								control={
									<Radio
										color="secondary"
										sx={{
											color: "white",
										}}
									/>
								}
								label={<span className="arvo-regular-italic">Medium</span>}
							/>
							<FormControlLabel
								value={SLOW_ANIMATION_SPEED}
								control={
									<Radio
										color="secondary"
										sx={{
											color: "white",
										}}
									/>
								}
								label={<span className="arvo-regular-italic">Slow</span>}
							/>
						</RadioGroup>
					</div>
					<Button
						variant="contained"
						size="large"
						onClick={(e) => {
							getInitialGrid();
						}}>
						<div className="arvo-bold-italic"> Reset Grid</div>
					</Button>
				</div>
			</div>
			<div className="maze_container">
				<div
					ref={rootRef}
					className="maze_small_container"
					style={{
						display: "grid",
						gridTemplateColumns: `repeat(${NUMBER_OF_COL}, 1fr)`,
					}}>
					{grid.map((row) =>
						row.map((node, ind) => (
							<div
								key={ind}
								style={{
									width: `${NODE_SIZE}px`,
									height: `${NODE_SIZE}px`,
								}}>
								<Node
									row={node.row}
									col={node.col}
									isVisited={node.isVisited}
									isStartNode={node.isStartNode}
									isFinishNode={node.isFinishNode}
									isWall={node.isWall}
									isHurdle={node.isHurdle}
									onMouseDown={handleMouseDown}
									onMouseUp={handleMouseUp}
									onMouseEnter={handleMouseEnter}
									mouseIsPressed={mouseIsPressed}
								/>
							</div>
						))
					)}
				</div>
			</div>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={message.length > 0}
				onClose={() => {
					setMessage("");
				}}>
				<Alert
					onClose={() => setMessage("")}
					sx={{
						width: "100%",
					}}
					severity="error">
					{message}
				</Alert>
			</Snackbar>
		</div>
	);
};

export default Maze;

const toggleStartNode = (rootRef, grid, row, col, nodeRef) => {
	const prevStartNodeElement = rootRef.current.querySelector(
		`#node-${nodeRef.current.row}-${nodeRef.current.col}`
	);
	prevStartNodeElement.classList.remove("maze__start_node");
	const newStartNodeElement = rootRef.current.querySelector(
		`#node-${row}-${col}`
	);
	newStartNodeElement.classList.add("maze__start_node");
	nodeRef.current = grid[row][col];
};

const toggleFinishNode = (rootRef, grid, row, col, nodeRef) => {
	const prevFinishNodeElement = rootRef.current.querySelector(
		`#node-${nodeRef.current.row}-${nodeRef.current.col}`
	);
	prevFinishNodeElement.classList.remove("maze__finish_node");
	const newFinishNodeElement = rootRef.current.querySelector(
		`#node-${row}-${col}`
	);
	newFinishNodeElement.classList.add("maze__finish_node");
	nodeRef.current = grid[row][col];
};

const getNewGrid = (
	rootRef,
	grid,
	row,
	col,
	wallsIndex,
	hurdlesIndex,
	obstacle
) => {
	const newGrid = [...grid];
	const node = newGrid[row][col];
	let newNode = { ...node };
	if (obstacle === "wall") {
		if (!node.isHurdle) {
			newNode = { ...node, isWall: !node.isWall };
		}
	} else {
		if (!node.isWall) {
			newNode = { ...node, isHurdle: !node.isHurdle };
		}
	}
	newGrid[row][col] = newNode;

	const nodeElement = rootRef.current.querySelector(`#node-${row}-${col}`);

	if (newNode.isWall) {
		nodeElement.style.backgroundColor = WALL_CLR;
		wallsIndex.current.push({ row, col });
	} else if (newNode.isHurdle) {
		nodeElement.style.background = "url(/src/assets/hurdle.svg)";
		nodeElement.style.backgroundColor = HURDLE_CLR;
		hurdlesIndex.current.push({ row, col });
	} else {
		nodeElement.style.backgroundColor = CELL_CLR;
		nodeElement.style.background = "";
	}

	// nodeElement.classList.toggle("maze__wall_node");

	// newNode.isWall
	// 	? nodeElement.classList.add("maze__wall_node")
	// 	: nodeElement.classList.remove("maze__wall_node");

	return newGrid;
};
