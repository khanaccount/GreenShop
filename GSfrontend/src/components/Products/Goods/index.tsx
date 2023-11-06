import React from "react";
import s from "./index.module.scss";
import Pagination from "../Pagination";
import axios from "axios";

type Goods = {
	title: string;
	mainPrice: string;
	salePrice: string;
	mainImg: string;
	discountPercentage: string;
	discount: boolean;
	id: number;
};

const Goods: React.FC = () => {
	const itemsPerPage = 9;
	const [currentPage, setCurrentPage] = React.useState(1);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

	const [items, setItems] = React.useState<Goods[]>([]);

	React.useEffect(() => {
		axios.get("http://127.0.0.1:8000/").then((response) => {
			setItems(response.data);
		});
	}, []);

	const displayedItems = items.slice(startIndex, endIndex);

	return (
		<div className={s.goods}>
			<div className={s.cards}>
				{displayedItems.map((item) => (
					<div key={item.id} className={s.card}>
						<div className={s.cardImg}>
							<img src={item.mainImg} alt={item.title} />{" "}
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
							<p className={s.goodsName}>{item.title}</p>
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
				totalPages={Math.ceil(items.length / itemsPerPage)}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
};

export default Goods;
