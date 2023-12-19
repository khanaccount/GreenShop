import React from "react";
import { Link, useParams } from "react-router-dom";
import s from "./index.module.scss";

const Path: React.FC = () => {
	const { id } = useParams<{ id: string }>();

	const pathItems = [
		{ name: "Home", path: "/", isHome: true },
		{ name: "Shop", path: "/" },
		{ name: "Cart", path: "/Shop/Cart" }
	];

	const getPathItems = () => {
		const items = [];
		for (let i = 0; i < pathItems.length; i++) {
			items.push(
				<React.Fragment key={pathItems[i].name}>
					{i > 0 && <p>/</p>}
					{id === pathItems[i].name ? (
						<p>{pathItems[i].name}</p>
					) : (
						<Link to={pathItems[i].path} className={pathItems[i].isHome ? s.home : undefined}>
							{pathItems[i].name}
						</Link>
					)}
				</React.Fragment>
			);
		}
		return items;
	};

	return <div className={s.path}>{getPathItems()}</div>;
};

export default Path;
