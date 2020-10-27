import React from "react";
import ToolTip from "../tooltip";
import { Screen, ResponsiveScreen } from "../screen";
import Context from "../../Context";

import "./main.scss";

class Main extends React.Component {
	state = { active: 0, reload: 0, view: 0 };
	static contextType = Context;
	parentScreen = React.createRef();

	handleClick = (id) => {
		let { mobile, tablet, laptop } = this.context.list;
		let newSelectedList = this.context.selectedList;

		let newMobile = mobile.map((m) => {
			if (m.id === id || id === -1) m.selected = 0;
			return m;
		});
		let newTablet = tablet.map((m) => {
			if (m.id === id || id === -1) m.selected = 0;
			return m;
		});
		let newLaptop = laptop.map((m) => {
			if (m.id === id || id === -1) m.selected = 0;
			return m;
		});
		let newList = {
			mobile: newMobile,
			tablet: newTablet,
			laptop: newLaptop,
		};
		if (id === -1)
			newSelectedList = [
				{
					id: 0,
					name: "Responsive",
					w: 1440,
					h: 920,
					selected: 1,
				},
			];
		else newSelectedList = newSelectedList.filter((e) => e.id !== id);
		this.context.selectComponent(newList, newSelectedList);
	};

	render() {
		const { active, reload, view } = this.state;
		return (
			<div className="main flex flex-col ai-center jc-start">
				<div className="topNav noScrollWidthX">
					<div className="cont flex ai-center jc-center">
						{this.context.selectedList &&
							this.context.selectedList.map((el, i) => (
								<div
									key={i}
									className={`elTab flex ai-center jc-center ${
										active === i ? "active" : "inactive"
									}`}
									onClick={() => {
										this.setState({ active: i, view: 0 });
										if (reload && this.context.link) {
											document.getElementById("iframe").src = "";
											setTimeout(
												() =>
													(document.getElementById(
														"iframe"
													).src = this.context.link),
												200
											);
										}
									}}
								>
									{el.name}
									<ToolTip text={el.w + " x " + el.h} />
								</div>
							))}
					</div>
				</div>
				<div
					onClick={() => {
						this.handleClick(-1);
						this.setState({ active: 0, view: 0 });
					}}
					className="reset"
				>
					<span role="img" aria-label="reset">
						✂️
					</span>
					<ToolTip text={"Reset View List"} />
				</div>
				<div className="screenBody" id="parentScreen" ref={this.parentScreen}>
					{this.context.selectedList[active] &&
						(active === 0 ? (
							<ResponsiveScreen
								active={active}
								parentScreen={this.parentScreen}
								reload={reload}
								changeReload={() => this.setState({ reload: !reload })}
								link={this.context.link}
							/>
						) : (
							<Screen
								turned={view}
								turn={() => this.setState({ view: !this.state.view })}
								active={active}
								reload={reload}
								changeReload={() => this.setState({ reload: !reload })}
								del={() => {
									this.handleClick(this.context.selectedList[active].id);
									this.setState({ active: 0 });
								}}
								link={this.context.link}
							/>
						))}
				</div>
			</div>
		);
	}
}

export default Main;
