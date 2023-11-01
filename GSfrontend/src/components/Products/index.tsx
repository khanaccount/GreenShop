import React from "react";

import PriceRange from "./PriceRange";
import Categories from "./Categories";
import Size from "./Size";
import Sale from "./Sale";

import s from "./index.module.scss";
import Sorting from "./Sorting";

const Products: React.FC = () => {
	return (
		<div className={s.products}>
			<div className={s.leftBlock}>
				<div className={s.filters}>
					<Categories />
					<PriceRange />
					<Size />
				</div>
				<Sale />
			</div>
			<div className={s.rightBlock}>
				<Sorting />
			</div>
		</div>
	);
};

export default Products;
