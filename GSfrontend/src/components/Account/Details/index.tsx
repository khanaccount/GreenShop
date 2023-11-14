import React from "react";
import s from "./index.module.scss";

const Details: React.FC = () => {
	return (
		<div className={s.details}>
			<h5>Personal Information</h5>
			<form>
				<label>
					<p>
						Email address <span>*</span>
					</p>
					<input type="text" name="name" />
				</label>
			</form>
		</div>
	);
};

export default Details;
