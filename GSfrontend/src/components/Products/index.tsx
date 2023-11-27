import React, { useState } from "react";
import PriceRange from "./PriceRange";
import Categories from "./Categories";
import Size from "./Size";
import Sale from "./Sale";
import Sorting from "./Sorting";
import Goods from "./Goods";

import s from "./index.module.scss";

interface ProductsProps {}

const Products: React.FC<ProductsProps> = () => {
	const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
	const [sizesData, setSizesData] = useState<{ [key: string]: number }>({});
	const [selectedSize, setSelectedSize] = useState<string | null>(null);

	const handleFilterChange = (newPriceRange: number[]) => {
		setPriceRange(newPriceRange);
	};

	return (
		<div className={s.products}>
			<div className={s.leftBlock}>
				<div className={s.filters}>
					<Categories />
					<PriceRange onFilterChange={handleFilterChange} />
					<Size sizesData={sizesData} setSelectedSize={setSelectedSize} />
				</div>
				<Sale />
			</div>
			<div className={s.rightBlock}>
				<Sorting />
				<Goods priceRange={priceRange} setSizesData={setSizesData} selectedSize={selectedSize} />
			</div>
		</div>
	);
};

export default Products;
