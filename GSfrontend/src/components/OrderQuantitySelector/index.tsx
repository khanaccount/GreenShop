import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../../api/auth";
import s from "./index.module.scss";
import Delete from "./svg/delete";

interface Order {
	customer: number;
	date: string;
	id: number;
	isCompleted: boolean;
}

interface Product {
	id: number;
	name: string;
	mainPrice: string;
	salePrice: string;
	reviewCount: number;
	rating: number;
	categories: number;
	descriptionInfo: string;
	discount: boolean;
	discountPercentage: number;
	mainImg: string;
	newArriwals: boolean;
	shortDescriptionInfo: string;
	size: number[];
	sku: string;
}

interface OrderItem {
	id: number;
	order: Order;
	product: Product;
	quantity: number;
}

const OrderQuantitySelector: React.FC = () => {
	const [items, setItems] = useState<OrderItem[]>([]);

	console.log(items);

	useEffect(() => {
		const authHeaders = getAuthHeaders();
		axios
			.get("http://127.0.0.1:8000/shop/cart/", authHeaders)
			.then((response) => {
				setItems(response.data);
			})
			.catch((error) => {
				console.error("Error response:", error);
			});
	}, []);

	const handleDelete = (itemId: number) => {
		const authHeaders = getAuthHeaders();
		axios
			.delete(`http://127.0.0.1:8000/shop/orderItem/${itemId}/`, authHeaders)
			.then(() => {
				setItems(items.filter((item) => item.id !== itemId));
				console.log(`Item with ID ${itemId} deleted successfully.`);
			})
			.catch((error) => {
				console.error(`Error deleting item with ID ${itemId}:`, error);
			});
	};

	return (
		<div className={s.OrderQuantitySelector}>
			<div className={s.goods}>
				<div className={s.categories}>
					<h5 className={s.products}>Products</h5>
					<h5 className={s.price}>Price</h5>
					<h5 className={s.quantity}>Quantity</h5>
					<h5 className={s.total}>Total</h5>
				</div>
				{items.map((item) => (
					<div key={item.id} className={s.goodsBlock}>
						<div className={s.info}>
							<img width={70} height={70} src={`/${item.product.mainImg}`} alt="mainImg" />
							<div className={s.nameSku}>
								<p>{item.product.name}</p>
								<p className={s.sku}>
									SKU: <span>{item.product.sku}</span>
								</p>
							</div>
						</div>
						<p className={s.price}>{item.product.salePrice}</p>
						<div className={s.quantity}>
							<button className={s.minus}>-</button>
							<span>{item.quantity}</span>
							<button className={s.plus}>+</button>
						</div>

						<p className={s.total}></p>

						<button onClick={() => handleDelete(item.id)}>
							<Delete />
						</button>
					</div>
				))}
			</div>
			<div className={s.totalPrice}>
				<h1>CartTotal</h1>
				<h3>Coupon Apply</h3>
				<form className={s.couponForm}>
					<input type="text" placeholder="Enter coupon code" />
					<button type="submit">Apply</button>
				</form>
			</div>
		</div>
	);
};

export default OrderQuantitySelector;
