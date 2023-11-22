import React from "react";

import Header from "../components/Header";
import Path from "../components/Shop/Path";
import ProductSlider from "../components/Shop/ProductSlider";
import Footer from "../components/Footer";

export const Shop: React.FC = () => {
	return (
		<div className="container">
			<Header />
			<Path />
			<ProductSlider />
			<Footer />
		</div>
	);
};
