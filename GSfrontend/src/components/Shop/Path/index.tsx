import React from "react";
import { Link, useParams } from "react-router-dom";
import s from "./index.module.scss";

const Path: React.FC = () => {
	const { id } = useParams<{ id: string }>();

	return (
		<div className={s.path}>
			<Link to={"/"} className={s.home}>
				Home
			</Link>
			<p>/</p>
			<p>Shop</p>
			{id && (
				<>
					<p>/</p>
					<p>{id}</p>
				</>
			)}
		</div>
	);
};

export default Path;
