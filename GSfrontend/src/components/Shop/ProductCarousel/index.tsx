import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import s from "./index.module.scss";

type Items = {
	name: string;
	price: string;
	img: string;
	id: string;
};

const carts: Items[] = [
	{
		name: "Beach Spider Lily",
		price: "$129.00",
		img: "/img/goods/01.png",
		id: "1"
	},
	{
		name: "Beach Spider Lily",
		price: "$129.00",
		img: "/img/goods/01.png",
		id: "2"
	},
	{
		name: "Beach Spider Lily",
		price: "$129.00",
		img: "/img/goods/01.png",
		id: "3"
	},
	{
		name: "Beach Spider Lily",
		price: "$129.00",
		img: "/img/goods/01.png",
		id: "4"
	},
	{
		name: "Beach Spider Lily",
		price: "$129.00",
		img: "/img/goods/01.png",
		id: "5"
	}
];

const ProductCarousel: React.FC = () => {
	return (
		<div className={s.productCarousel}>
			<h5 className={s.title}>Releted Products</h5>
			<Carousel
				className={s.carousel}
				showArrows={false}
				showStatus={false}
				showThumbs={false}
				infiniteLoop={true}
				autoPlay={true}
				interval={5000}>
				<div className={s.carouselItems}>
					{carts.map((item) => (
						<div key={item.id} className={s.item}>
							<div className={s.imgBlock}>
								<img src={item.img} alt="plant" />
							</div>
							<h5 className={s.itemName}>{item.name}</h5>
							<p className={s.itemPrice}>{item.price}</p>
						</div>
					))}
				</div>
				<div className={s.carouselItems}>
					{carts.map((item) => (
						<div key={item.id} className={s.item}>
							<div className={s.imgBlock}>
								<img src={item.img} alt="plant" />
							</div>
							<h5 className={s.itemName}>{item.name}</h5>
							<p className={s.itemPrice}>{item.price}</p>
						</div>
					))}
				</div>
				<div className={s.carouselItems}>
					{carts.map((item) => (
						<div key={item.id} className={s.item}>
							<div className={s.imgBlock}>
								<img src={item.img} alt="plant" />
							</div>
							<h5 className={s.itemName}>{item.name}</h5>
							<p className={s.itemPrice}>{item.price}</p>
						</div>
					))}
				</div>
			</Carousel>
		</div>
	);
};

export default ProductCarousel;
