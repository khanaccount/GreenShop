import React from "react";

import PriceRange from "./PriceRange";
import Categories from "./Categories";
import Size from "./Size";
import Sale from "./Sale";
import Sorting from "./Sorting";
import Goods from "./Goods";

import s from "./index.module.scss";

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
				<Goods />
			</div>
		</div>
	);
};

export default Products;
