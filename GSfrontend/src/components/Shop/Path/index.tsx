import React from "react";
import { Link } from "react-router-dom";
import s from "./index.module.scss";

const Path: React.FC = () => {
	return (
		<div className={s.path}>
			<Link to={"/"} className={s.home}>
				Home
			</Link>
			<p>/</p>
			<Link to={"/shop"}>Shop</Link>
		</div>
	);
};

export default Path;
