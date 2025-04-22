import React from "react";
import ReactDOM from "react-dom/client";

import ErrorPage from "./ErrorPage.jsx";
import Maze from "./1/Maze.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Maze />,
		errorElement: <ErrorPage />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);