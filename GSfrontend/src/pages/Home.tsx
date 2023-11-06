import React from "react";

import Header from "../components/Header";
import Carousel from "../components/Carousel";
import Products from "../components/Products";
import Info from "../components/Info";

export const Home: React.FC = () => {
	return (
		<div className="container">
			<Header />
			<Carousel />
			<Products />
			<Info />
		</div>
	);
};
