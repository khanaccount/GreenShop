import React, { useState } from "react";

import s from "./index.module.scss";

import UserSvg from "./UserSvg";
import FavoriteSvg from "./FavoriteSvg";
import OrderSvg from "./OrderSvg";
import LocationSvg from "./LocationSvg";

type Card = {
	title: string;
	icon: React.ReactNode;
	id: number;
};

const items: Card[] = [
	{
		title: "Account Details",
		icon: <UserSvg />,
		id: 1
	},
	{
		title: "Address",
		icon: <LocationSvg />,
		id: 2
	},
	{
		title: "Orders",
		icon: <OrderSvg />,
		id: 3
	},
	{
		title: "Wishlist",
		icon: <FavoriteSvg />,
		id: 4
	}
];

type SwitchBlockProps = {
	showDetails: () => void;
	showAddress: () => void;
};

const SwitchBlock: React.FC<SwitchBlockProps> = ({ showAddress, showDetails }) => {
	const [active, setActive] = useState<number | null>(1);

	const handleActive = (id: number) => {
		setActive(id);
		if (id === 1) {
			showDetails(); // Show Details when Account Details is clicked
		} else if (id === 2) {
			showAddress(); // Show Address when Address is clicked
		}
	};

	return (
		<div className={s.switchBlock}>
			<h5>My Account</h5>
			{items.map((item) => (
				<div
					key={item.id}
					onClick={() => handleActive(item.id)}
					className={`${s.card} ${active === item.id ? s.cardActive : ""}`}>
					{item.icon}
					<p>{item.title}</p>
				</div>
			))}

			<div className={s.logOut}>
				<button>
					<img width={20} height={20} src="img/account/logout.svg" alt="logOut" />
					<p>Logout</p>
				</button>
			</div>
		</div>
	);
};

export default SwitchBlock;