import React from "react";

import s from "./index.module.scss";

type CategoriesItems = {
	title: string;
	number: string;
	id: number;
};

const item: CategoriesItems[] = [
	{ title: "House Plants", id: 1, number: "(33)" },
	{ title: "Potter Plants", id: 2, number: "(12)" },
	{ title: "Seeds", id: 3, number: "(65)" },
	{ title: "Small Plants", id: 4, number: "(39)" },
	{ title: "Big Plants", id: 5, number: "(23)" },
	{ title: "Succulents", id: 6, number: "(17)" },
	{ title: "Trerrariums", id: 7, number: "(19)" },
	{ title: "Gardening", id: 8, number: "(13)" },
	{ title: "Accessories", id: 9, number: "(18)" }
];

const Categories: React.FC = () => {
	const [activeCategory, setActiveCategory] = React.useState<number | null>(null);

	const handleCategoryClick = (id: number) => {
		setActiveCategory(id);
	};

	return (
		<div className={s.categories}>
			<h5>Categories</h5>
			{item.map((category) => (
				<div
					key={category.id}
					onClick={() => handleCategoryClick(category.id)}
					className={category.id === activeCategory ? s.active : ""}>
					<p>{category.title}</p>
					<p>{category.number}</p>
				</div>
			))}
		</div>
	);
};

export default Categories;
