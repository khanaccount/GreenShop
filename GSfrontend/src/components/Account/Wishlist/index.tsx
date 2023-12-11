import React, { useState, useEffect } from "react";
import axios from "axios";
import s from "./index.module.scss";

const Wishlist: React.FC = () => {
	const [cardData, setCardData] = useState<any>(null);
	useEffect(() => {
		const fetchCardData = async () => {
			try {
				const response = await axios.get("http://127.0.0.1:8000/shop/product/favourite/");
				setCardData(response.data);
				console.log(cardData);
			} catch (error) {
				console.error("Ошибка при получении данных карточки:", error);
			}
		};

		fetchCardData();
	}, []);

	return (
		<div className={s.wishlist}>
			<div className={s.card}>
				<div className={s.cardImg}>
					<p className={s.discount}>{cardData.discount} OFF</p>
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
		</div>
	);
};

export default Wishlist;
