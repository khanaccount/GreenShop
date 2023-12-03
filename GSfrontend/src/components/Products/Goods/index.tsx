import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import s from "./index.module.scss";
import Pagination from "../Pagination";
import axios from "axios";

interface Goods {
	name: string;
	mainPrice: string;
	salePrice: string;
	mainImg: string;
	discountPercentage: string;
	discount: boolean;
	id: number;
	size: {
		id: number;
		name: string;
	};
	categories: {
		id: number;
		name: string;
	};
}

interface GoodsProps {
	priceRange: number[];
	setSizesData: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
	selectedSize: string | null;
	selectedCategory: string | null;
	setCategoriesData: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

const sizeMap: { [key: string]: string } = {
	Small: "s",
	Medium: "m",
	Large: "l",
	"Extra Large": "xl"
};

const Goods: React.FC<GoodsProps> = ({
	priceRange,
	setSizesData,
	selectedSize,
	selectedCategory,
	setCategoriesData
}) => {
	const itemsPerPage = 9;
	const [currentPage, setCurrentPage] = React.useState(1);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

	const [items, setItems] = React.useState<Goods[]>([]);
	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/shop/product/")
			.then((response) => {
				setItems(response.data);
				const sizes: { [key: string]: number } = {};
				const categories: { [key: string]: number } = {};
				response.data.forEach((item: Goods) => {
					const sizeName = item.size.name;
					sizes[sizeName] = (sizes[sizeName] || 0) + 1;

					const categoryName = item.categories.name;
					categories[categoryName] = (categories[categoryName] || 0) + 1;
				});
				setSizesData(sizes);
				setCategoriesData(categories);
			})
			.catch((error) => {
				console.error("Ошибка при получении данных: ", error);
			});
	}, [setSizesData, setCategoriesData]);

	// Получаем сокращенное обозначение размера
	const getSizeCode = (sizeName: string): string => {
		return sizeMap[sizeName] || "";
	};

	// Фильтруем товары по выбранному размеру и ценовому диапазону
	const filteredItems = useMemo(() => {
		let filtered = items;

		if (selectedSize) {
			const selectedSizeCode = getSizeCode(selectedSize);
			filtered = filtered.filter((item) => {
				const itemSizeCode = item.size.name.toLowerCase();
				return itemSizeCode === selectedSizeCode;
			});
		}

		if (selectedCategory) {
			filtered = filtered.filter((item) => {
				return item.categories.name === selectedCategory;
			});
		}

		// Фильтрация по ценовому диапазону
		filtered = filtered.filter((item) => {
			const itemPrice = parseFloat(item.salePrice.slice(1));
			return itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
		});

		return filtered;
	}, [items, priceRange, selectedSize, selectedCategory]);
	// Получаем товары для отображения на текущей странице
	const displayedItems = filteredItems.slice(startIndex, endIndex);

	return (
		<div className={s.goods}>
			<div className={s.cards}>
				{displayedItems.map((item) => (
					<div key={item.id} className={s.card}>
						<div className={s.cardImg}>
							<Link to={`/shop/${item.id}/`}>
								<img src={item.mainImg} alt={item.name} />
							</Link>
							{item.discount ? <p className={s.discount}>{item.discountPercentage}% OFF</p> : null}
							<div className={s.hoverLinks}>
								<a href="">
									<img src="img/goods/cart.svg" alt="cart" />
								</a>
								<a href="">
									<img src="img/goods/favorite.svg" alt="favorite" />
								</a>
							</div>
						</div>
						<div className={s.goodsInfo}>
							<p className={s.goodsName}>{item.name}</p>
							<div className={s.goodsPrices}>
								<p className={s.main}>{item.salePrice}</p>
								{item.discount ? <p className={s.sale}>{item.mainPrice}</p> : null}
							</div>
						</div>
					</div>
				))}
			</div>
			<Pagination
				currentPage={currentPage}
				totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
};

export default Goods;
