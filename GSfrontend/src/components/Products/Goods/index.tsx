import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import s from "./index.module.scss";
import Pagination from "../Pagination";
import axios from "axios";
import { getAuthHeaders } from "../../../api/auth";

import Heart from "./svg/Heart";

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

interface FavoriteProduct {
	id: number;
	product: {
		id: number;
		name: string;
		mainPrice: string;
		salePrice: string;
		discount: boolean;
	};
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
	const [currentPage, setCurrentPage] = React.useState(1);
	const [favoriteStates, setFavoriteStates] = React.useState<Map<number, boolean>>(new Map());
	const [items, setItems] = React.useState<Goods[]>([]);
	const itemsPerPage = 9;
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

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

	const getSizeCode = (sizeName: string): string => {
		return sizeMap[sizeName] || "";
	};

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

		filtered = filtered.filter((item) => {
			const itemPrice = parseFloat(item.salePrice.slice(1));
			return itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
		});

		return filtered;
	}, [items, priceRange, selectedSize, selectedCategory]);

	const displayedItems = filteredItems.slice(startIndex, endIndex);

	useEffect(() => {
		const fetchFavoriteStatus = async () => {
			try {
				const authHeaders = getAuthHeaders();
				const response = await axios.get<FavoriteProduct[]>(
					"http://127.0.0.1:8000/shop/product/favourite/",
					authHeaders
				);
				const updatedFavoriteStates = new Map<number, boolean>();

				response.data.forEach((item: FavoriteProduct) => {
					updatedFavoriteStates.set(item.product.id, true);
				});

				setFavoriteStates(updatedFavoriteStates);
			} catch (error) {
				console.error("Error fetching favorite status:", error);
			}
		};

		fetchFavoriteStatus();
	}, []);

	const toggleFavorite = async (id: number) => {
		try {
			const authHeaders = getAuthHeaders();
			const updatedFavoriteStates = new Map<number, boolean>(favoriteStates);

			if (updatedFavoriteStates.get(id)) {
				await deleteFavorite(id);
				updatedFavoriteStates.set(id, false);
			} else {
				const response = await axios.post(
					`http://127.0.0.1:8000/shop/product/favourite/${id}/`,
					{},
					authHeaders
				);

				if (response.status === 200) {
					updatedFavoriteStates.set(id, true);
				}
			}

			setFavoriteStates(updatedFavoriteStates);
		} catch (error) {
			console.error("Error when switching favorite factor:", error);
		}
	};

	const deleteFavorite = async (id: number) => {
		try {
			const authHeaders = getAuthHeaders();
			await axios.delete(`http://127.0.0.1:8000/shop/product/favourite/${id}/`, authHeaders);
			console.log("Product removed from favorites");
		} catch (error) {
			console.error("Error deleting favorite:", error);
		}
	};

	const handleFavoriteClick = async (id: number) => {
		await toggleFavorite(id);
	};

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
								<button className={`${s.cart}`}>
									<img src="img/goods/cart.svg" alt="cart" />
								</button>
								<button
									onClick={() => handleFavoriteClick(item.id)}
									className={`${s.favorite} ${
										favoriteStates.get(item.id) ? s.favoriteActive : ""
									}`}>
									<Heart />
								</button>
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
