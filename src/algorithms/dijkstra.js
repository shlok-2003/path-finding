const HURDLE_WEIGHT = 5;

export const dijkstra = (grid, startNode, finishNode) => {
	if (!startNode || !finishNode || startNode === finishNode) {
		return "NOT POSSIBLE";
	}

	const visitedNodesInOrder = [];
	startNode.distance = 0;

	const unVisitedNodes = getAllNodes(grid);
	while (unVisitedNodes.length) {
		sortNodesByDistance(unVisitedNodes);

		const closestNode = unVisitedNodes.shift();

		if (closestNode.isWall) {
			continue;
		}

		if (closestNode.distance === Infinity) {
			return visitedNodesInOrder;
		}

		closestNode.isVisited = true;
		visitedNodesInOrder.push(closestNode);

		if (closestNode === finishNode) {
			return visitedNodesInOrder;
		}

		updateUnvisitedNeighbors(closestNode, grid);
	}
};

const sortNodesByDistance = (nodes) => {
	nodes.sort((node1, node2) => {
		return node1.distance - node2.distance;
	});
};

const updateUnvisitedNeighbors = (node, grid) => {
	const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
	for (let neighbor of unvisitedNeighbors) {
		if (neighbor.isHurdle) {
			neighbor.distance = node.distance + HURDLE_WEIGHT;
		} else {
			neighbor.distance = node.distance + 1;
		}
		neighbor.previousNode = node;
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

const getAllNodes = (grid) => {
	const nodes = [];
	grid.map((row) => {
		row.map((node) => {
			nodes.push(node);
		});
	});
	return nodes;
};

export const getNodesInShortestPathOrder = (finishNode) => {
	const nodesInShortestPathOrder = [];
	let currentNode = finishNode;
	while (currentNode !== null) {
		nodesInShortestPathOrder.unshift(currentNode);
		currentNode = currentNode.previousNode;
	}

	return nodesInShortestPathOrder;
};
