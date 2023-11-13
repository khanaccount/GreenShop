import React, { useState } from "react";
import s from "./index.module.scss";

type Card = {
	title: string;
	icon: string;
	id: number;
};

const items: Card[] = [
	{
		title: "Account Details",
		icon: "img/account/user.svg",
		id: 1
	},
	{
		title: "Address",
		icon: "img/account/location.svg",
		id: 2
	},
	{
		title: "Orders",
		icon: "img/account/order.svg",
		id: 3
	},
	{
		title: "Wishlist",
		icon: "img/account/favorite.svg",
		id: 4
	}
];

const SwitchBlock: React.FC = () => {
	const [active, setActive] = useState<number | null>(null);

	const handleActive = (id: number) => {
		setActive(id === active ? null : id);
	};

	return (
		<div className={s.switchBlock}>
			<h5>My Account</h5>
			{items.map((item) => (
				<div
					key={item.id}
					onClick={() => handleActive(item.id)}
					className={`${s.card} ${active === item.id ? s.cardActive : ""}`}>
					<img src={item.icon} alt={item.title} width={20} height={20} />
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
