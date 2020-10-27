import React, { Component } from "react";
import MainComponent from "./components";
import Context from "./Context";
import { data } from "./viewport";

import "./App.scss";

class App extends Component {
	state = {
		toggle: 0,
		list: null,
		view: 0,
		loading: false,
		selectedList: [],
		link: "",
	};

	componentDidMount() {
		let list = localStorage.getItem("screenList");
		let sel = localStorage.getItem("screens");
		if (sel) {
			if (!list) {
				sel = JSON.parse(sel);
				const { mobile, tablet, laptop } = data;
				let newMobile = mobile.map((m) => {
					let p = sel.filter((s) => s.id === m.id);
					if (p.length === 0) return m;
					else return p[0];
				});
				let newTablet = tablet.map((m) => {
					let p = sel.filter((s) => s.id === m.id);
					if (p.length === 0) return m;
					else return p[0];
				});
				let newLaptop = laptop.map((m) => {
					let p = sel.filter((s) => s.id === m.id);
					if (p.length === 0) return m;
					else return p[0];
				});
				let newData = {
					mobile: newMobile,
					tablet: newTablet,
					laptop: newLaptop,
				};
				localStorage.setItem("screenList", JSON.stringify(newData));
				this.setState({ list: newData, selectedList: sel });
			} else {
				this.setState({
					list: JSON.parse(list),
					selectedList: JSON.parse(sel),
				});
			}
		} else {
			localStorage.setItem(
				"screens",
				JSON.stringify([
					{
						id: 0,
						name: "Responsive",
						h: 400,
						w: 800,
					},
				])
			);
			if (!list) {
				localStorage.setItem("screenList", JSON.stringify(data));
				this.setState({
					list: data,
					selectedList: [
						{
							id: 0,
							name: "Responsive",
							h: 400,
							w: 800,
						},
					],
				});
			} else {
				this.setState({
					list: JSON.parse(list),
					selectedList: [
						{
							id: 0,
							name: "Responsive",
							h: 400,
							w: 800,
						},
					],
				});
			}
		}
	}

	setLoading = (loading) => this.setState({ loading });

	changeView = (view) => this.setState({ view });

	// setList = (list) => this.setState({ list });
	toggleSidebar = () => this.setState({ toggle: !this.state.toggle });

	selectComponent = (list, selList) => {
		localStorage.setItem("screens", JSON.stringify(selList));
		localStorage.setItem("screenList", JSON.stringify(list));
		this.setState({ selectedList: selList, list: list });
	};

	updateLink = (url) => this.setState({ link: url });

	render() {
		const { list, view, loading, selectedList, toggle, link } = this.state;

		return (
			<div className="App">
				<Context.Provider
					value={{
						loading: loading,
						setLoading: this.setLoading,
						view: view,
						changeView: this.changeView,
						list: list,
						// setList: this.setList,
						selectedList: selectedList,
						selectComponent: this.selectComponent,
						toggle: toggle,
						toggleSidebar: this.toggleSidebar,
						link: link,
						updateLink: this.updateLink,
					}}
				>
					<MainComponent />
				</Context.Provider>
			</div>
		);
	}
}

export default App;
