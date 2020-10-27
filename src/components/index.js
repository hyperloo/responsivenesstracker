import React from "react";
import SideBar from "./sidebar";
import SearchBar from "./SearchBar";
import Main from "./main";

import "./index.scss";

class Index extends React.Component {
	render() {
		return (
			<div className="index flex flex-col ai-center jc-start">
				<SideBar />
				<SearchBar />
				<Main />
			</div>
		);
	}
}

export default Index;
