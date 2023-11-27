import React, { useEffect } from "react";
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
}

interface GoodsProps {
	priceRange: number[];
	setSizesData: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
	selectedSize: string | null;
}

const sizeMap: { [key: string]: string } = {
	Small: "s",
	Medium: "m",
	Large: "l",
	"Extra Large": "xl"
};

const Goods: React.FC<GoodsProps> = ({ priceRange, setSizesData, selectedSize }) => {
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
				console.log(response.data);
				// Группировка товаров по размерам и подсчет количества для каждого размера
				const sizes: { [key: string]: number } = {};
				response.data.forEach((item: Goods) => {
					const sizeName = item.size.name; // Предполагаем, что здесь хранится информация о размере
					sizes[sizeName] = (sizes[sizeName] || 0) + 1;
				});
				setSizesData(sizes); // Используем setSizesData для обновления состояния размеров
			})
			.catch((error) => {
				console.error("Error fetching data: ", error);
			});
	}, []);

	const getSizeCode = (sizeName: string): string => {
		return sizeMap[sizeName] || ""; // Вернуть соответствующее однобуквенное представление или пустую строку, если нет совпадений
	};

	const filteredItems = React.useMemo(() => {
		let filtered = items; // Используем все товары
		if (selectedSize) {
			const selectedSizeCode = getSizeCode(selectedSize);
			filtered = items.filter((item) => {
				const itemSizeCode = item.size.name.toLowerCase(); // Предполагается, что item.size.name содержит полное название размера
				return itemSizeCode === selectedSizeCode;
			});
		}

		// Дополнительная фильтрация по цене
		filtered = filtered.filter((item) => {
			const itemPrice = parseFloat(item.salePrice.slice(1));
			return itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
		});

		return filtered;
	}, [items, priceRange, selectedSize]);

	const displayedItems = filteredItems.slice(startIndex, endIndex);

	return (
		<div className={s.goods}>
			<div className={s.cards}>
				{displayedItems.map((item) => (
					<div key={item.id} className={s.card}>
						<div className={s.cardImg}>
							<img src={item.mainImg} alt={item.name} />
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
