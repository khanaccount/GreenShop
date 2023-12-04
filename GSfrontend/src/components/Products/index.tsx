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
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [categoriesData, setCategoriesData] = useState<{ [key: string]: number }>({});

	const handleFilterChange = (newPriceRange: number[]) => {
		setPriceRange(newPriceRange);
	};

	return (
		<div className={s.products}>
			<div className={s.leftBlock}>
				<div className={s.filters}>
					<Categories categoriesData={categoriesData} setSelectedCategory={setSelectedCategory} />
					<PriceRange onFilterChange={handleFilterChange} />
					<Size sizesData={sizesData} setSelectedSize={setSelectedSize} />
				</div>
				<Sale />
			</div>
			<div className={s.rightBlock}>
				<Sorting />
				<Goods
					priceRange={priceRange}
					selectedCategory={selectedCategory}
					setCategoriesData={setCategoriesData}
					setSizesData={setSizesData}
					selectedSize={selectedSize}
				/>
			</div>
		</div>
	);
};

export default Products;
