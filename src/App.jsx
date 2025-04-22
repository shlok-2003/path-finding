import { delay, motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./App.css";

function App() {
	const option_card_animation1 = {
		opacity: 1,
	};
	// const option_card_animation2 = {
	// 	x: [2000, 0],
	// };
	const option_card_transition = {
		delay: 1,
		duration: 1.5,
		ease: "easeIn",
	};
	return (
		<motion.div className="home__container">
			<motion.div
				className="proj-title italianno-regular"
				animate={{ y: [-1000, 0] }}
				transition={{ type: "spring", duration: 0.9, ease: "easeInOut" }}>
				Visualizer
			</motion.div>
			<motion.div className="home__options">
				<Link to="/1">
					<motion.div
						className="bg-container"
						initial={{ opacity: 0 }}
						animate={option_card_animation1}
						transition={option_card_transition}>
						<motion.div className="home__option_card arvo-regular">
							Path Finder
						</motion.div>
					</motion.div>
				</Link>
				<Link to="/2">
					<motion.div
						className="bg-container"
						initial={{ opacity: 0 }}
						animate={option_card_animation1}
						transition={option_card_transition}>
						<motion.div className="home__option_card arvo-regular">
							Sorting Algos
						</motion.div>
					</motion.div>
				</Link>
			</motion.div>
		</motion.div>
	);
}

export default App;
