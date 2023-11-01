import React, { useState } from "react";
import s from "./index.module.scss";

const Sorting: React.FC = () => {
	const [activeCategory, setActiveCategory] = useState<number | null>(1);
	const [isArrowActive, setIsArrowActive] = useState(false);
	const [sortBy, setSortBy] = useState("Default sorting");

	const handleSortOptionClick = (option: string) => {
		setSortBy(option);
		toggleArrowStyle();
	};

	const handleCategoryClick = (id: number) => {
		setActiveCategory(id);
	};
	const toggleArrowStyle = () => {
		setIsArrowActive(!isArrowActive);
	};

	return (
		<div className={s.sorting}>
			<div className={s.category}>
				<h5
					onClick={() => handleCategoryClick(1)}
					className={activeCategory === 1 ? s.activeCategory : ""}>
					All Plants
				</h5>
				<h5
					onClick={() => handleCategoryClick(2)}
					className={activeCategory === 2 ? s.activeCategory : ""}>
					New Arrivals
				</h5>
				<h5
					onClick={() => handleCategoryClick(3)}
					className={activeCategory === 3 ? s.activeCategory : ""}>
					Sale
				</h5>
			</div>
			<div className={s.sortBlock}>
				<h5>Short by:</h5>
				<h5>{sortBy}</h5>
				<img
					className={isArrowActive ? `${s.arrow} ${s.arrowActive}` : s.arrow}
					src="img/sort/arrow.svg"
					alt="arrow"
					onClick={toggleArrowStyle}
				/>
				<div className={isArrowActive ? `${s.sortOptions}` : `${s.sortOptionsHidden}`}>
					<h5 onClick={() => handleSortOptionClick("Default sorting")}>Default sorting</h5>
					<h5 onClick={() => handleSortOptionClick("Price: Low to High")}>Price: Low to High</h5>
					<h5 onClick={() => handleSortOptionClick("Price: High to Low")}>Price: Low to Low</h5>
					<h5 onClick={() => handleSortOptionClick("Most popular")}>Most popular</h5>
					<h5 onClick={() => handleSortOptionClick("Price: High to Low")}>Rating</h5>
				</div>
			</div>
		</div>
	);
};

export default Sorting;
