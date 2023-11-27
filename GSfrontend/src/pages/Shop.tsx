import React from "react";

import Header from "../components/Header";
import Path from "../components/Shop/Path";
import ProductCart from "../components/Shop/ProductCart";
import Footer from "../components/Footer";
import ProductCarousel from "../components/Shop/ProductCarousel";

export const Shop: React.FC = () => {
	return (
		<div className="container">
			<Header />
			<Path />
			<ProductCart />
			<ProductCarousel />
			<Footer />
		</div>
	);
};
