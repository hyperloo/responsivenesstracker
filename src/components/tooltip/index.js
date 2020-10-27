import React from "react";

import "./tooltip.scss";

const Tooltip = ({ text }) => {
	return (
		<span className={`tooltip`}>
			<div className="wrapper">{text}</div>
		</span>
	);
};

export default Tooltip;
