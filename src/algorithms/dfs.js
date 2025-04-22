export const dfs = (grid, startNode, finishNode) => {
	if (!startNode || !finishNode || startNode === finishNode) {
		return "NOT POSSIBLE";
	}

	const visitedNodesInOrder = [];

	dfsHelper(startNode, grid, finishNode, visitedNodesInOrder);

	return visitedNodesInOrder;
};

const dfsHelper = (node, grid, destination, visitedNodesInOrder) => {
	// If the node is a wall, skip it
	if (node.isWall) {
		return;
	}

	node.isVisited = true;
	visitedNodesInOrder.push(node);

	if (node === destination) {
		return;
	}

	const { row, col } = node;

	const di = [0, 0, -1, 1];
	const dj = [1, -1, 0, 0];

	for (let k = 0; k < 4; k++) {
		if (visitedNodesInOrder[visitedNodesInOrder.length - 1] === destination) {
			return;
		}
		const newRow = row + di[k];
		const newCol = col + dj[k];
		if (isValid(newRow, newCol, grid)) {
			const adjNode = grid[newRow][newCol];
			if (!adjNode.isVisited && !adjNode.isWall) {  // Check if the adjacent node is a wall
				adjNode.previousNode = node;
				dfsHelper(adjNode, grid, destination, visitedNodesInOrder);
			}
		}
	}
};

const isValid = (row, col, grid) => {
	return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
};
