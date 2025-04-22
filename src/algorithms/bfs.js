export const bfs = (grid, startNode, finishNode) => {
	if (!startNode || !finishNode || startNode === finishNode) {
		return "NOT POSSIBLE";
	}

	const visitedNodesInOrder = [];
	startNode.distance = 0;
	startNode.isVisited = true;

	const unVisitedNodes = [];
	unVisitedNodes.push(startNode);
	let ctr = 0;
	while (unVisitedNodes.length) {
		const curNode = unVisitedNodes.shift();

		console.log(curNode.row, curNode.col);

		if (curNode.isWall) {
			continue;
		}

		visitedNodesInOrder.push(curNode);

		updateUnvisitedNeighbors(curNode, grid, unVisitedNodes);

		if (curNode === finishNode) {
			return visitedNodesInOrder;
		}
		ctr++;
	}
};

const updateUnvisitedNeighbors = (node, grid, unVisitedNodes) => {
	const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
	for (let neighbor of unvisitedNeighbors) {
		neighbor.distance = node.distance + 1;
		neighbor.previousNode = node;
		unVisitedNodes.push(neighbor);
		neighbor.isVisited = true;
	}
};

const getUnvisitedNeighbors = (node, grid) => {
	const neighbors = [];
	const { row, col } = node;
	if (row > 0) {
		neighbors.push(grid[row - 1][col]);
	}
	if (row < grid.length - 1) {
		neighbors.push(grid[row + 1][col]);
	}
	if (col > 0) {
		neighbors.push(grid[row][col - 1]);
	}
	if (col < grid[0].length - 1) {
		neighbors.push(grid[row][col + 1]);
	}
	return neighbors.filter((neighbor) => !neighbor.isVisited);
};
