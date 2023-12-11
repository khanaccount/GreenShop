import React, { useState, useEffect } from "react";
import axios from "axios";
import s from "./index.module.scss";
import { getAuthHeaders } from "../../../api/auth";

interface CardData {
	img: string;
	name: string;
	mainPrice: string;
	salePrice: string;
}

const Wishlist: React.FC = () => {
	const [cardData, setCardData] = useState<CardData | null>(null);

	useEffect(() => {
		const fetchCardData = async () => {
			try {
				const authHeaders = getAuthHeaders();
				const response = await axios.get(`http://127.0.0.1:8000/shop/product/favourite/`, {
					headers: {
						Authorization: authHeaders?.headers?.Authorization
					}
				});

				const fetchedData: CardData = response.data;
				setCardData(fetchedData);
			} catch (error) {
				console.error("Error while receiving card data:", error);
			}
		};

		fetchCardData();
	}, []);

	return (
		<div className={s.wishlist}>
			{cardData && (
				<div className={s.card}>
					<div className={s.cardImg}>
						<p className={s.discount}> OFF</p>
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
						<p className={s.goodsName}>{cardData.name}</p>
						<div className={s.goodsPrices}>
							<p className={s.main}>{cardData.salePrice}</p>
							<p className={s.sale}>{cardData.mainPrice}</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Wishlist;
