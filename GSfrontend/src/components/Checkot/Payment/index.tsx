import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-number-input/input";
import { Link } from "react-router-dom";
import { getAuthHeaders } from "../../../api/auth";
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

export interface OrderInfo {
	prices: OrderPrices;
	output: OrderItem[];
}

const Payment: React.FC = () => {
	const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
	const [showRegionDropdown, setShowRegionDropdown] = useState(false);
	const [showStateDropdown, setShowStateDropdown] = useState(false);
	const [filteredRegions, setFilteredRegions] = useState<string[]>([]);
	const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
	const [filteredStates, setFilteredStates] = useState<string[]>([]);
	const [showRegionDropdownImg, setShowRegionDropdownImg] = useState(false);
	const [showStateDropdownImg, setShowStateDropdownImg] = useState(false);
	const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
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
	console.log(orderInfo);

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

	const handlePhoneChange = (value: string | undefined) => {
		setPhoneNumber(value);
	};

	const toggleRegionDropdown = () => {
		setShowRegionDropdown(!showRegionDropdown);
		setShowStateDropdown(false);
		setShowRegionDropdownImg(!showRegionDropdownImg);
		setShowStateDropdownImg(false);
		if (!showRegionDropdown) {
			handleRegionInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
		}
	};

	const toggleStateDropdown = () => {
		setShowStateDropdown(!showStateDropdown && !!selectedCountry);
		setShowRegionDropdown(false);
		setShowStateDropdownImg(!showStateDropdownImg);
		setShowRegionDropdownImg(false);
		if (!showStateDropdown) {
			handleStateInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
		}
	};

	const handleRegionSelect = (selectedRegion: string) => {
		const regionInput = document.getElementById("Region") as HTMLInputElement;
		regionInput.value = selectedRegion;
		setSelectedCountry(selectedRegion);
		setShowRegionDropdown(false);
		setShowStateDropdown(false);
	};

	const handleStateSelect = (selectedState: string) => {
		const stateInput = document.getElementById("State") as HTMLInputElement;
		stateInput.value = selectedState;
		setShowStateDropdown(false);
	};

	const handleRegionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value.toLowerCase();

		type Country = {
			id: number;
			country: string;
		};

		const availableRegions: Country[] = [
			{ id: 1, country: "USA" },
			{ id: 2, country: "Russia" },
			{ id: 3, country: "Germany" },
			{ id: 4, country: "Japan" },
			{ id: 5, country: "China" }
		];

		const filteredRegions = availableRegions
			.filter((region) => region.country.toLowerCase().startsWith(inputValue))
			.map((region) => region.country);

		setFilteredRegions(filteredRegions);
		setShowRegionDropdown(true);
		setSelectedCountry(undefined);
		setFilteredStates([]);
		setShowStateDropdown(false);

		if (!inputValue) {
			handleRegionInputClear();
		}
	};

	const handleRegionInputClear = () => {
		const regionInput = document.getElementById("Region") as HTMLInputElement;
		const stateInput = document.getElementById("State") as HTMLInputElement;

		regionInput.value = "";
		stateInput.value = "";
		setSelectedCountry(undefined);
		setShowStateDropdown(false);
	};

	const handleStateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value.toLowerCase();

		const statesByCountry: Record<string, string[]> = {
			USA: ["New York", "California", "Texas", "Florida"],
			Russia: ["Moscow", "Saint Petersburg", "Novosibirsk"],
			Germany: ["Berlin", "Munich", "Hamburg"],
			Japan: ["Tokyo", "Osaka", "Kyoto"],
			China: ["Beijing", "Shanghai", "Guangzhou"]
		};

		const selectedStates = statesByCountry[selectedCountry || ""];

		if (selectedStates && selectedCountry) {
			const filteredStates = selectedStates.filter((state) =>
				state.toLowerCase().startsWith(inputValue)
			);
			setFilteredStates(filteredStates);
			setShowStateDropdown(true);
		} else {
			setShowStateDropdown(false);
		}
	};

	const handleMethodClick = (methodNumber: number) => {
		if (selectedMethod === methodNumber) {
			setSelectedMethod(null);
		} else {
			setSelectedMethod(methodNumber);
		}
	};

	return (
		<div className={s.payment}>
			<div className={s.addressBlock}>
				<h5 className={s.billingAddress}>Billing Address</h5>
				<div className={s.inputBlock}>
					<form className={s.firstForm}>
						<label htmlFor="firstName">
							<p className={s.formText}>
								First Name <span>*</span>
							</p>
							<input type="text" id="firstName" name="firstName" />
						</label>
					</form>
					<form className={s.secondForm}>
						<label htmlFor="lastName">
							<p className={s.formText}>
								Last Name <span>*</span>
							</p>
							<input type="text" id="lastName" name="lastName" />
						</label>
					</form>
				</div>

				<div className={s.inputBlock}>
					<form className={s.firstForm}>
						<label htmlFor="Region">
							<p className={s.formText}>
								Country / Region <span>*</span>
							</p>
							<input
								onChange={handleRegionInputChange}
								onClick={toggleRegionDropdown}
								placeholder="Select a country / region"
								type="text"
								id="Region"
								name="Region"
							/>
							<img
								className={showRegionDropdown ? s.arrdownActive : s.arrdown}
								src="/img/address/arrdown.svg"
								alt="arrdown"
							/>
						</label>
						{showRegionDropdown && (
							<div className={s.dropdownContent}>
								<ul className={s.regionList}>
									{filteredRegions.map((region, index) => (
										<li key={index} onClick={() => handleRegionSelect(region)}>
											{region}
										</li>
									))}
								</ul>
							</div>
						)}
					</form>

					<form className={s.secondForm}>
						<label htmlFor="City">
							<p className={s.formText}>
								Town / City <span>*</span>
							</p>
							<input type="text" id="City" name="City" />
						</label>
					</form>
				</div>

				<div className={s.inputBlock}>
					<form className={s.firstForm}>
						<label htmlFor="Region">
							<p className={s.formText}>
								Street Address <span>*</span>
							</p>
							<input
								placeholder="House number and street name"
								type="text"
								id="Region"
								name="Region"
							/>
						</label>
					</form>
					<form className={s.secondForm}>
						<label htmlFor="appartment">
							<p className={s.formText}>
								Appartment <span>*</span>
							</p>
							<input
								placeholder="Appartment, suite, unit, etc. (optional)"
								type="text"
								id="appartment"
								name="appartment"
							/>
						</label>
					</form>
				</div>

				<div className={s.inputBlock}>
					<form className={s.firstForm}>
						<label htmlFor="State">
							<p className={s.formText}>
								State <span>*</span>
							</p>
							<input
								onChange={handleStateInputChange}
								onClick={toggleStateDropdown}
								placeholder="Select a state"
								type="text"
								id="State"
								name="State"
								disabled={!selectedCountry}
							/>
							<img
								className={showStateDropdown ? s.arrdownActive : s.arrdown}
								src="/img/address/arrdown.svg"
								alt="arrdown"
							/>
						</label>
						{showStateDropdown && (
							<div className={s.dropdownContent}>
								<ul className={s.stateList}>
									{filteredStates.map((state, index) => (
										<li key={index} onClick={() => handleStateSelect(state)}>
											{state}
										</li>
									))}
								</ul>
							</div>
						)}
					</form>
					<form className={s.secondForm}>
						<label htmlFor="City">
							<p className={s.formText}>
								Town / City <span>*</span>
							</p>
							<input type="text" id="City" name="City" />
						</label>
					</form>
				</div>

				<div className={s.inputBlock}>
					<form className={s.firstForm}>
						<label htmlFor="EmailAddress">
							<p className={s.formText}>
								Email address<span>*</span>
							</p>
							<input type="text" id="EmailAddress" name="EmailAddress" />
						</label>
					</form>
					<form className={s.secondForm}>
						<label htmlFor="PhoneNumber">
							<p className={s.formText}>
								Phone Number <span>*</span>
							</p>
							<PhoneInput
								id="PhoneNumber"
								name="PhoneNumber"
								placeholder="Enter phone number"
								value={phoneNumber}
								onChange={handlePhoneChange}
							/>
						</label>
					</form>
				</div>

				<h5 className={s.differentAddress}>Ship to a different address?</h5>
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
					<div className={s.method} onClick={() => handleMethodClick(2)}>
						<img className={s.cyrcle0} src="/img/payment/cyrcle0.svg" alt="cyrcle" />
						{selectedMethod === 2 && (
							<img className={s.cyrcle1} src="/img/payment/cyrcle1.svg" alt="cyrcle" />
						)}

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

				<button className={s.placeOrder}>Place Order</button>
			</div>
		</div>
	);
};

export default Payment;
