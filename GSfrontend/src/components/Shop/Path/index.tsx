import React from "react";
import s from "./index.module.scss";

const Path: React.FC = () => {
	return (
		<div className={s.path}>
			<p className={s.home}>Home</p>
			<p>/</p>
			<p>Shop</p>
		</div>
	);
};

export default Path;
