import React from "react";

import s from "./index.module.scss";

type SizesItems = {
	title: string;
	number: string;
	id: number;
};

const item: SizesItems[] = [
	{ title: "Small", id: 1, number: "(119)" },
	{ title: "Medium", id: 2, number: "(86)" },
	{ title: "Large", id: 3, number: "(78)" }
];

const Size: React.FC = () => {
	const [activeSizes, setActiveSizes] = React.useState<number | null>(null);

	const handleCategoryClick = (id: number) => {
		setActiveSizes(id);
	};

	return (
		<div className={s.size}>
			<h5>Size</h5>
			{item.map((size) => (
				<div
					key={size.id}
					onClick={() => handleCategoryClick(size.id)}
					className={size.id === activeSizes ? s.active : ""}>
					<p>{size.title}</p>
					<p>{size.number}</p>
				</div>
			))}
		</div>
	);
};

export default Size;
