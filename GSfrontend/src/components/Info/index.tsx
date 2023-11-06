import React from "react";

import s from "./index.module.scss";
import FindMore from "./FindMore";

const Info: React.FC = () => {
	return (
		<div className={s.info}>
			<FindMore />
		</div>
	);
};

export default Info;
