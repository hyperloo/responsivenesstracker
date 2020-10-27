import React from "react";
import Context from "../../Context";

import "./sidebar.scss";

class SideBar extends React.Component {
	static contextType = Context;

	state = {
		adding: -1,
		name: "",
		w: 0,
		h: 0,
	};

	handleClick = (k, i, id) => {
		let newList = this.context.list;
		let newSelectedList = this.context.selectedList;

		if (newList[k][i].selected) {
			newList[k][i].selected = 0;
			newSelectedList = newSelectedList.filter((e) => e.id !== id);
		} else {
			newList[k][i].selected = 1;
			newSelectedList.push(newList[k][i]);
		}
		this.context.selectComponent(newList, newSelectedList);
	};

	addToList = (type, item) => {
		let newList = this.context.list;
		newList[type].push(item);
		this.context.selectComponent(newList, this.context.selectedList);
		this.setState({ adding: -1, name: "", w: 0, h: 0 });
	};

	delItem = (type, id) => {
		let newList = this.context.list;
		let newSelectedList = this.context.selectedList;
		newList[type] = newList[type].filter((e) => e.id !== id);
		newSelectedList = newSelectedList.filter((e) => e.id !== id);

		this.context.selectComponent(newList, newSelectedList);
	};

	render() {
		const { adding, name, w, h } = this.state;

		return (
			<>
				<div
					className={`modal ${this.context.toggle ? "out" : "in"}`}
					onClick={this.context.toggleSidebar}
				></div>
				<div
					className={`sidebar flex flex-col ${
						this.context.toggle ? "expand" : "shrink"
					}`}
				>
					<div
						className="flex ai-center jc-center cross"
						onClick={this.context.toggleSidebar}
					></div>
					<div className="topBar flex ai-center jc-center">
						View Ports <span>[w x h]</span>
					</div>
					<div className="inner noScrollWidthY">
						{this.context.list &&
							Object.keys(this.context.list).map((k, i) => (
								<div className="master" key={i}>
									<div className="title flex ai-center jc-center">
										<span>
											<img src={require(`../../../assets/${k}.png`)} alt={k} />
										</span>
										&nbsp;&nbsp;&nbsp;{k.toUpperCase()}
									</div>
									<div className="child">
										{this.context.list[k].map(
											({ name, w, h, id, selected, custom }, i) => (
												<div className="sub flex ai-center jc-start" key={i}>
													<div
														className={`sign ${selected ? "minus" : "plus"}`}
														onClick={() => this.handleClick(k, i, id)}
													></div>
													<div className="flex ai-center jc-between">
														<span>{name}</span>{" "}
														<span>
															{w}x{h}
														</span>
													</div>
													{custom && (
														<div
															className="sign cross flex ai-center jc-center"
															onClick={() => this.delItem(k, id)}
														>
															X
														</div>
													)}
												</div>
											)
										)}
										{!(adding === i) ? (
											<div
												className="add flex jc-center ai-center"
												onClick={() => this.setState({ adding: i })}
											>
												+
											</div>
										) : (
											<div className="sub addInput flex ai-center jc-start">
												<span
													role="img"
													aria-label="tick"
													className="tick sign flex ai-center jc-center"
													onClick={(e) => {
														if (!name || name.length === 0 || w <= 0 || h <= 0)
															return;
														this.addToList(k, {
															id: 30 + i * 30,
															selected: 0,
															name: name,
															w: w,
															h: h,
															custom: true,
														});
													}}
												>
													<svg
														className="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit"
														focusable="false"
														viewBox="0 0 24 24"
														aria-hidden="true"
													>
														<path
															fill="#ffffff"
															d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"
														></path>
													</svg>
												</span>
												<div className="flex ai-center jc-between">
													<span>
														<input
															type="text"
															required
															value={name}
															onChange={(e) =>
																this.setState({ name: e.target.value })
															}
															placeholder="Name"
														/>
													</span>{" "}
													<span className="dim">
														<input
															type="number"
															required
															value={w}
															onChange={(e) => {
																if (Number.isInteger(parseInt(e.target.value)))
																	this.setState({ w: e.target.value });
															}}
															placeholder="width"
														/>
														x
														<input
															type="number"
															required
															value={h}
															onChange={(e) => {
																if (Number.isInteger(parseInt(e.target.value)))
																	this.setState({ h: e.target.value });
															}}
															placeholder="height"
														/>
													</span>
													<span
														className="cross sign flex ai-center jc-center"
														onClick={() => this.setState({ adding: -1 })}
													>
														X
													</span>
												</div>
											</div>
										)}
									</div>
								</div>
							))}
					</div>
				</div>
			</>
		);
	}
}

export default SideBar;
