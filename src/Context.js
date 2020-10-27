import React from "react";

export default React.createContext({
	loading: false,
	setLoading: () => {},
	view: 0,
	changeView: (view) => {},
	msg: null,
	updateMessage: (status, msg) => {},
	list: null,
	// setList: (list) => {},
	selectedList: [],
	selectComponent: (list) => {},
	toggle: 0,
	toggleSidebar: () => {},
	link: "",
	updateLink: (link) => {},
});
