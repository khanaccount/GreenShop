import React from "react";

import s from "./index.module.scss";

type Goods = {
	title: string;
	mainPrice: string;
	salePrice: string;
	mainImg: string;
	cartImg: string;
	favoriteImg: string;
	discountPercentage: string;
	discount: boolean;
	sale: boolean;
	id: number;
};

const items: Goods[] = [
	{
		id: 1,
		title: "Barberton Daisy",
		mainPrice: "$119.00",
		salePrice: "$229.00",
		mainImg: "img/goods/01.png",
		cartImg: "img/goods/cart.svg",
		favoriteImg: "img/goods/favorite.svg",
		sale: true,
		discount: false,
		discountPercentage: "15"
	},
	{
		id: 2,
		title: "Barberton Daisy",
		mainPrice: "$119.00",
		salePrice: "$229.00",
		mainImg: "img/goods/02.png",
		cartImg: "img/goods/cart.svg",
		favoriteImg: "img/goods/favorite.svg",
		sale: false,
		discount: true,
		discountPercentage: "15"
	},
	{
		id: 3,
		title: "Barberton Daisy",
		mainPrice: "$119.00",
		salePrice: "$229.00",
		mainImg: "img/goods/03.png",
		cartImg: "img/goods/cart.svg",
		favoriteImg: "img/goods/favorite.svg",
		sale: false,
		discount: false,
		discountPercentage: "15"
	},
	{
		id: 4,
		title: "Barberton Daisy",
		mainPrice: "$119.00",
		salePrice: "$229.00",
		mainImg: "img/goods/04.jpg",
		cartImg: "img/goods/cart.svg",
		favoriteImg: "img/goods/favorite.svg",
		sale: false,
		discount: true,
		discountPercentage: "15"
	},
	{
		id: 5,
		title: "Barberton Daisy",
		mainPrice: "$119.00",
		salePrice: "$229.00",
		mainImg: "img/goods/05.png",
		cartImg: "img/goods/cart.svg",
		favoriteImg: "img/goods/favorite.svg",
		sale: false,
		discount: false,
		discountPercentage: "15"
	},
	{
		id: 6,
		title: "Barberton Daisy",
		mainPrice: "$119.00",
		salePrice: "$229.00",
		mainImg: "img/goods/06.png",
		cartImg: "img/goods/cart.svg",
		favoriteImg: "img/goods/favorite.svg",
		sale: false,
		discount: true,
		discountPercentage: "15"
	},
	{
		id: 7,
		title: "Barberton Daisy",
		mainPrice: "$119.00",
		salePrice: "$229.00",
		mainImg: "img/goods/07.png",
		cartImg: "img/goods/cart.svg",
		favoriteImg: "img/goods/favorite.svg",
		sale: false,
		discount: false,
		discountPercentage: "15"
	},
	{
		id: 8,
		title: "Barberton Daisy",
		mainPrice: "$119.00",
		salePrice: "$229.00",
		mainImg: "img/goods/08.png",
		cartImg: "img/goods/cart.svg",
		favoriteImg: "img/goods/favorite.svg",
		sale: false,
		discount: true,
		discountPercentage: "15"
	},
	{
		id: 9,
		title: "Barberton Daisy",
		mainPrice: "$119.00",
		salePrice: "$229.00",
		mainImg: "img/goods/09.png",
		cartImg: "img/goods/cart.svg",
		favoriteImg: "img/goods/favorite.svg",
		sale: false,
		discount: false,
		discountPercentage: "15"
	}
];

const Goods: React.FC = () => {
	return (
		<div className={s.goods}>
			<div className={s.cards}>
				{items.map((item) => (
					<div key={item.id} className={s.card}>
						<div className={s.cardImg}>
							<img src={item.mainImg} alt={item.title} />{" "}
							{item.discount ? <p className={s.discount}>{item.discountPercentage}% OFF</p> : null}
							<div className={s.hoverLinks}>
								<a href="">
									<img src={item.cartImg} alt="cart" />
								</a>
								<a href="">
									<img src={item.favoriteImg} alt="favorite" />
								</a>
							</div>
						</div>
						<div className={s.goodsInfo}>
							<p className={s.goodsName}>{item.title}</p>
							<div className={s.goodsPrices}>
								<p className={s.main}>{item.mainPrice}</p>
								{item.sale ? <p className={s.sale}>{item.salePrice}</p> : null}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Goods;
