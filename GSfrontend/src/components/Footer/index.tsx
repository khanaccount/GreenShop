import React from "react";

import s from "./index.module.scss";

type Card = {
	title: string;
	info: string;
	imgPot: string;
	imgPlant: string;
	id: number;
};

const itemsTop: Card[] = [
	{
		title: "Garden Care",
		info: "We are an online plant shop offering a wide range of cheap and trendy plants.",
		imgPot: "img/footer/top/1pot.svg",
		imgPlant: "img/footer/top/1plant.svg",
		id: 1
	},
	{
		title: "Plant Renovation",
		info: "We are an online plant shop offering a wide range of cheap and trendy plants.",
		imgPot: "img/footer/top/2pot.svg",
		imgPlant: "img/footer/top/2plant.svg",
		id: 2
	},
	{
		title: "Watering Graden",
		info: "We are an online plant shop offering a wide range of cheap and trendy plants.",
		imgPot: "img/footer/top/1pot.svg",
		imgPlant: "img/footer/top/1plant.svg",
		id: 3
	}
];

type MiddleItems = {
	title: string;
	img: string;
	id: number;
};

const itemsMiddle: MiddleItems[] = [
	{
		title: "70 West Buckingham Ave. Farmingdale, NY 11735",
		img: "img/footer/middle/location.svg",
		id: 1
	},
	{
		title: "contact@greenshop.com ",
		img: "img/footer/middle/message.svg",
		id: 2
	},
	{
		title: "+88 01911 717 490",
		img: "img/footer/middle/calling.svg",
		id: 3
	}
];

const Footer: React.FC = () => {
	return (
		<div className={s.footer}>
			<div className={s.footerTop}>
				<div className={s.info}>
					{itemsTop.map((item) => (
						<div key={item.id} className={s.card}>
							<img className={s.cyrcle} src="img/footer/top/01.png" alt="cyrcle" />
							<img className={s.topPlant} width={60} height={45} src={item.imgPlant} alt="plant" />
							<img className={s.pot} width={60} src={item.imgPot} alt="pot" />
							<h5>{item.title}</h5>
							<p>{item.info}</p>
						</div>
					))}
				</div>
				<div className={s.formBlock}>
					<h4>Would you like to join newsletters?</h4>
					<form>
						<label>
							<input
								className={s.input}
								type="text"
								name="name"
								placeholder="enter your email address..."
							/>
						</label>
						<input className={s.inputBtn} type="submit" value="Join" />
					</form>
					<p>
						We usually post offers and challenges in newsletter. We’re your online houseplant
						destination. We offer a wide range of houseplants and accessories shipped directly from
						our (green)house to yours!{" "}
					</p>
				</div>
				<div className={s.join}></div>
			</div>
			<div className={s.footerMiddle}>
				<img width={170} src="img/footer/middle/logo.svg" alt="logo" />
				{itemsMiddle.map((item) => (
					<div key={item.id}>
						<img width={25} height={25} src={item.img} alt="location" /> <p>{item.title}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Footer;
