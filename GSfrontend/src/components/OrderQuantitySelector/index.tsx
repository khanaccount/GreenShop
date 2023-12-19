import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { getAuthHeaders } from "../../api/auth";

import s from "./index.module.scss";
import Delete from "./svg/delete";

export interface OrderItem {
	id: number;
	name: string;
	price: string;
	quantity: number;
	mainImg: string;
	totalPrice: string;
	sku: string;
	size: string;
}

export interface OrderPrices {
	subtotalPrice: string;
	shippingPrice: string;
	totalPrice: string;
}

export interface OrderInfo {
	prices: OrderPrices;
	output: OrderItem[];
}

const OrderQuantitySelector: React.FC = () => {
	const [orderInfo, setOrderInfo] = useState<OrderInfo>({
		prices: {
			subtotalPrice: "",
			shippingPrice: "",
			totalPrice: ""
		},
		output: []
	});

	useEffect(() => {
		fetchItems();
	}, []);

	const fetchItems = () => {
		const authHeaders = getAuthHeaders();
		axios
			.get<OrderInfo>("http://127.0.0.1:8000/shop/cart/", authHeaders)
			.then((response) => {
				setOrderInfo(response.data);
			})
			.catch((error) => {
				console.error("Error response:", error);
			});
	};

	const handleDelete = (itemId: number, size: string) => {
		const authHeaders = getAuthHeaders();

		axios
			.delete(`http://127.0.0.1:8000/shop/orderItem/${itemId}/`, authHeaders)
			.then(() => {
				fetchItems();
				console.log(`Item with ID ${itemId} and size ${size} deleted successfully.`);
			})
			.catch((error) => {
				console.error(`Error deleting item with ID ${itemId} and size ${size}:`, error);
			});
	};

	const updateQuantity = (itemId: number, newQuantity: number) => {
		const authHeaders = getAuthHeaders();
		axios
			.put(
				`http://127.0.0.1:8000/shop/orderItem/${itemId}/`,
				{ quantity: newQuantity },
				authHeaders
			)
			.then(() => {
				fetchItems();
			})
			.catch((error) => {
				console.error(`Error updating quantity for item with ID ${itemId}:`, error);
			});
	};

	return (
		<div className={s.OrderQuantitySelector}>
			<div className={s.goods}>
				<div className={s.categories}>
					<h5 className={s.products}>Products</h5>
					<h5 className={s.size}>Size</h5>
					<h5 className={s.price}>Price</h5>
					<h5 className={s.quantity}>Quantity</h5>
					<h5 className={s.total}>Total</h5>
				</div>
				{orderInfo.output.map((item) => (
					<div key={item.id} className={s.goodsBlock}>
						<div className={s.info}>
							<img width={70} height={70} src={`/${item.mainImg}`} alt="mainImg" />
							<div className={s.nameSku}>
								<p>{item.name}</p>
								<p className={s.sku}>
									SKU: <span>{item.sku}</span>
								</p>
							</div>
						</div>
						<p className={s.size}>{item.size}</p>
						<p className={s.price}>{item.price}</p>
						<div className={s.quantity}>
							<button
								onClick={() => updateQuantity(item.id, item.quantity - 1)}
								className={s.minus}>
								-
							</button>
							<span>{item.quantity}</span>
							<button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={s.plus}>
								+
							</button>
						</div>
						<p className={s.total}>{item.totalPrice}</p>
						<button onClick={() => handleDelete(item.id, item.size)}>
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
				<div className={s.pricing}>
					<p className={s.text}>Subtotal</p>
					<p className={s.price}>{orderInfo.prices.subtotalPrice}</p>
				</div>
				<div className={s.pricing}>
					<p className={s.text}>Coupon Discount</p>
					<p>(-) 00.00</p>
				</div>
				<div className={s.pricing}>
					<p className={s.text}>Shipping</p>
					<p className={s.price}>{orderInfo.prices.shippingPrice}</p>
				</div>
				<div className={s.total}>
					<p>Total</p>
					<p className={s.price}>{orderInfo.prices.totalPrice}</p>
				</div>

				<button className={s.checkout}>Proceed To Checkout</button>
				<NavLink to={"/"} className={s.continue}>
					Continue Shopping
				</NavLink>
			</div>
		</div>
	);
};

export default OrderQuantitySelector;
