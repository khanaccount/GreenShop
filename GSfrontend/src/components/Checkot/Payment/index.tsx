import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuthHeaders } from "../../../api/auth";
import Delete from "../../OrderQuantitySelector/svg/delete";
import axios from "axios";

import s from "./index.module.scss";

export interface OrderItem {
	id: number;
	name: string;
	price: string;
	quantity: number;
	mainImg: string;
	totalPrice: string;
	sku: string;
	size: {
		id: number;
		name: string;
	};
	idProduct: number;
}

export interface OrderPrices {
	subtotalPrice: string;
	shippingPrice: string;
	totalPrice: string;
	isUsedCoupon: boolean;
	couponDiscount: string;
	isDiscountCoupon: boolean;
	isFreeDelivery: boolean;
}

interface ShippingAddress {
	id: number;
	state: string;
	phone: string;
	city: string;
	region: string;
	streetAddress: string;
	lastName: string;
	firstName: string;
	customer: {
		email: string;
		username: string;
		id: number;
	};
}

export interface OrderInfo {
	prices: OrderPrices;
	output: OrderItem[];
}

const Payment: React.FC = () => {
	const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
	const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
	const [shippingAddress, setShippingAddress] = useState<ShippingAddress[]>([]);
	const [orderInfo, setOrderInfo] = useState<OrderInfo>({
		prices: {
			subtotalPrice: "",
			shippingPrice: "",
			totalPrice: "",
			isUsedCoupon: false,
			couponDiscount: "",
			isDiscountCoupon: false,
			isFreeDelivery: false
		},
		output: []
	});

	useEffect(() => {
		fetchItems();
		fetchShippingAddresses();
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

	const fetchShippingAddresses = () => {
		const token = getAuthHeaders();
		axios
			.get("http://127.0.0.1:8000/shop/shippingAddress/", token)
			.then((response) => {
				setShippingAddress(response.data);
			})
			.catch((error) => {
				console.error("Error fetching shipping address data: ", error);
			});
	};

	const handleMethodClick = (methodNumber: number) => {
		if (selectedMethod === methodNumber) {
			setSelectedMethod(null);
		} else {
			setSelectedMethod(methodNumber);
		}
	};

	const handleAddressClick = (index: number) => {
		setSelectedAddress(index === selectedAddress ? null : index);
	};

	const handleDeleteAddress = (addressIdToDelete: number) => {
		const authHeaders = getAuthHeaders();
		const requestData = {
			shippingAddress: addressIdToDelete
		};

		axios
			.delete("http://127.0.0.1:8000/shop/shippingAddress/", {
				headers: {
					Authorization: authHeaders?.headers?.Authorization
				},
				data: requestData
			})
			.then(() => {
				console.log(`Shipping address with ID ${addressIdToDelete} deleted successfully`);
				axios
					.get("http://127.0.0.1:8000/shop/shippingAddress/", authHeaders)
					.then((response) => {
						setShippingAddress(response.data);
					})
					.catch((error) => {
						console.error("Error fetching updated shipping addresses after deletion: ", error);
					});
			})
			.catch((error) => {
				console.error(`Error deleting shipping address with ID ${addressIdToDelete}:`, error);
			});
	};

	const handlePlaceOrder = () => {
		if (!isAddressSelected || !isMethodSelected) {
			alert("Address or Payment Method is not selected. Cannot place order.");
			return;
		}
		const authHeaders = getAuthHeaders();
		const selectedAddressId = selectedAddress !== null ? shippingAddress[selectedAddress].id : null;
		const requestData = {
			shippingAddress: selectedAddressId
		};

		const placeOrderButtonStyle =
			isAddressSelected && isMethodSelected ? s.placeOrderSelected : s.placeOrder;

		if (placeOrderButtonStyle === s.placeOrderDisabled) {
			console.log("Button is disabled. Cannot place order.");
			return;
		}

		axios
			.post("http://127.0.0.1:8000/shop/transaction/", requestData, {
				headers: {
					Authorization: authHeaders?.headers?.Authorization
				}
			})
			.then((response) => {
				setShippingAddress(response.data);
			})
			.catch((error) => {
				console.error("Error fetching shipping address data: ", error);
			});
	};

	const isAddressSelected = selectedAddress !== null;
	const isMethodSelected = selectedMethod !== null;

	const placeOrderButtonStyle =
		isAddressSelected && isMethodSelected ? s.placeOrderSelected : s.placeOrder;

	return (
		<div className={s.payment}>
			<div className={s.addressBlock}>
				<h5 className={s.billingAddress}>Billing Address</h5>
				<Link className={s.newAdressesLink} to={"/account"}>
					<button className={s.newAdresses}>Add new addresses</button>
				</Link>
				<div className={s.addedAddresses}>
					{shippingAddress.map((address, index) => (
						<div onClick={() => handleAddressClick(index)} className={s.adderss} key={index}>
							<img className={s.cyrcle0} src="/img/payment/cyrcle0.svg" alt="cyrcle" />
							{selectedAddress === index && (
								<img className={s.cyrcle1} src="/img/payment/cyrcle1.svg" alt="cyrcle" />
							)}
							<h3>Shipping Address {index + 1}</h3>

							<div>
								<p className={s.addressField}>First Name: {address.firstName}</p>
								<p className={s.addressField}>Last Name: {address.lastName}</p>
							</div>
							<div>
								<p className={s.addressField}>Country / Region: {address.region}</p>
								<p className={s.addressField}>Town / City: span {address.city}</p>
								<p className={s.addressField}>Street Address: {address.streetAddress}</p>
							</div>
							<div>
								<p className={s.addressField}>State: {address.state}</p>
								<p className={s.addressField}>Phone: {address.phone}</p>
							</div>
							<button onClick={() => handleDeleteAddress(address.id)}>
								<Delete />
							</button>
						</div>
					))}
				</div>
				<p className={s.optional}>Order notes (optional)</p>
				<form>
					<textarea className={s.notes} id="textInput" name="textInput"></textarea>
				</form>
			</div>
			<div className={s.order}>
				<h1>Your Order</h1>
				<div className={s.info}>
					<h3>Products</h3>
					<h3>Subtotal</h3>
				</div>

				{orderInfo.output.map((item) => (
					<div className={s.card} key={item.id}>
						<Link to={`/shop/${item.idProduct}`}>
							<img src={`/${item.mainImg}`} alt={item.name} />
						</Link>
						<div className={s.cardInfo}>
							<p className={s.cardInfoName}>{item.name}</p>
							<div className={s.cardInfoSku}>
								<p className={s.sku}>SKU:</p>
								<p className={s.number}>{item.sku}</p>
							</div>
						</div>
						<p className={s.size}>{item.size.name}</p>
						<p className={s.quantity}>(x {item.quantity})</p>
						<p className={s.price}>{item.totalPrice}</p>
					</div>
				))}
				<div className={s.pricingCards}>
					<div className={s.pricing}>
						<p className={s.text}>Subtotal</p>
						<p className={s.price}>{orderInfo.prices.subtotalPrice}</p>
					</div>
					<div className={s.pricing}>
						<p className={s.text}>Coupon Discount</p>
						<p>(-) {orderInfo.prices.couponDiscount}</p>
					</div>
					<div className={s.pricing}>
						<p className={s.text}>Shipping</p>
						<p className={s.price}>{orderInfo.prices.shippingPrice}</p>
					</div>
					<div className={s.total}>
						<p>Total</p>
						<p className={s.price}>{orderInfo.prices.totalPrice}</p>
					</div>
				</div>

				<div className={s.methods}>
					<h4>Payment Method</h4>
					<div className={s.method} onClick={() => handleMethodClick(1)}>
						<img className={s.cyrcle0} src="/img/payment/cyrcle0.svg" alt="cyrcle" />
						{selectedMethod === 1 && (
							<img className={s.cyrcle1} src="/img/payment/cyrcle1.svg" alt="cyrcle" />
						)}

						<img
							className={s.acceptedMethods}
							src="/img/footer/bottom/accept.png"
							alt="acceptMethods"
						/>
					</div>
					<div className={s.methodNone}>
						<p className={s.Cross}>x</p>

						<h3>Cash on delivery</h3>
					</div>
					<div className={s.method} onClick={() => handleMethodClick(3)}>
						<img className={s.cyrcle0} src="/img/payment/cyrcle0.svg" alt="cyrcle" />
						{selectedMethod === 3 && (
							<img className={s.cyrcle1} src="/img/payment/cyrcle1.svg" alt="cyrcle" />
						)}

						<h3>Dorect bank transfer</h3>
					</div>
				</div>

				<button
					onClick={handlePlaceOrder}
					className={placeOrderButtonStyle ? s.placeOrderDisabled : s.placeOrder}>
					{placeOrderButtonStyle ? "Select address and Payment Method" : "Place Order"}
				</button>
			</div>
		</div>
	);
};

export default Payment;
