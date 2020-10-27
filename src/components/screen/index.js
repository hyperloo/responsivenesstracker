import React, { useContext } from "react";
import ToolTip from "../tooltip";
import Context from "../../Context";

import "./screen.scss";

export const Screen = ({
	active,
	del,
	link,
	turn,
	turned,
	reload,
	changeReload,
}) => {
	const context = useContext(Context);
	const { w, h, name } = context.selectedList[active];

	let div = document.getElementById("parentScreen");

	let r;
	if (!turned)
		r = Math.min((div.clientHeight - 64) / h, (div.clientWidth - 64) / w);
	else r = Math.min((div.clientHeight - 64) / w, (div.clientWidth - 64) / h);

	if (r > 1) r = 1;

	return (
		<>
			<div className="title flex ai-center jc-center">
				<div
					className="reload"
					onClick={changeReload}
					style={{ backgroundColor: reload ? "grey" : "transparent" }}
				>
					<span role="img" aria-label="reload">
						🔄
					</span>
					<ToolTip
						text={`${reload ? "Reload on Viewport change" : "Do not reload"}`}
					/>
				</div>
				<div className="dimensions">
					{!turned ? (
						<>
							<span>{w}</span> x <span>{h}</span>
						</>
					) : (
						<>
							<span>{h}</span> x <span>{w}</span>
						</>
					)}
				</div>
				<div
					className="rotate"
					onClick={() => turn(!turned)}
					style={{ backgroundColor: turned ? "lightgrey" : "transparent" }}
				>
					<img src={require("../rotate.svg")} alt="rotate" />
					<ToolTip text={`${turned ? "See Portrait" : "See Landscape"}`} />
				</div>

				<div
					className="cross"
					onClick={() => {
						del();
						turn(0);
					}}
				>
					X
					<ToolTip text="Delete viewport" />
				</div>
			</div>
			<div
				className="screen"
				style={{
					width: !turned ? `${w * r}px` : `${h * r}px`,
					height: !turned ? `${h * r}px` : `${w * r}px`,
				}}
			>
				{!link || link.length === 0 ? (
					<div className="msg flex flex-col ai-center jc-center">
						<span role="img" aria-labelledby="logo">
							🔗
						</span>
						Enter a Website Link to View
					</div>
				) : (
					<>
						<iframe
							id="iframe"
							src={link}
							title={name}
							width={!turned ? `${w}px` : `${h}px`}
							height={!turned ? `${h}px` : `${w}px`}
							style={{
								transform: `scale(${r})`,
								transformOrigin: "top left",
								backgroundImage: `url(${require(`../Spinner.gif`)})`,
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
							}}
						/>
					</>
				)}
			</div>
		</>
	);
};

export class ResponsiveScreen extends React.Component {
	static contextType = Context;

	mainH = this.props.parentScreen.current.clientHeight - 108;
	mainW = this.props.parentScreen.current.clientWidth - 108;
	// right = React.createRef();
	// down = React.createRef();
	screen = React.createRef();

	moR = false;
	moD = false;

	state = {
		nh: 0,
		nw: 0,
	};

	componentDidMount() {
		this.setState({
			nh: this.context.selectedList[this.props.active].h,
			nw: this.context.selectedList[this.props.active].w,
		});
	}

	render() {
		const { reload, changeReload } = this.props;

		const { nh, nw } = this.state;
		const name = this.context.selectedList[this.props.active].name;
		const link = this.context.link;
		let r1 = this.mainW / nw;
		let r2 = this.mainH / nh;

		let mini = r1 >= 1 && r2 >= 1 ? -1 : r2 < r1 ? 1 : 0;

		let style = {
			transformOrigin: "top left",
			backgroundImage: `url(${require(`../Spinner.gif`)})`,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center",
		};

		if (mini === -1) {
			// console.log("Ratio more than 1");
			style.height = `${nh}px`;
			style.width = `${nw}px`;
			style.transform = "scale(1)";
		} else if (mini === 0) {
			// console.log("WIdth Ratio SMaller");
			style.width = `${nw}px`;
			style.height = `${nh > this.mainH ? nh * (r2 / r1) : nh / r1}px`;
			style.transform = `scale(${r1})`;
		} else if (mini === 1) {
			// console.log("Height Ratio SMaller");
			style.height = `${nh}px`;
			style.width = `${nw > this.mainW ? nw * (r1 / r2) : nw / r2}px`;
			style.transform = `scale(${r2})`;
		}

		return (
			<>
				<div className="title flex ai-center jc-center">
					<div
						className="reload"
						onClick={changeReload}
						style={{ backgroundColor: reload ? "grey" : "transparent" }}
					>
						<span role="img" aria-label="reload">
							🔄
						</span>
						<ToolTip
							text={`${reload ? "Reload on Viewport change" : "Do not reload"}`}
						/>
					</div>
					<div className="dimensions">
						{
							<>
								<span>
									<input
										step="10"
										value={Math.floor(nw)}
										type="number"
										onChange={(e) => {
											if (Number.isInteger(parseInt(e.target.value))) {
												let newList = this.context.selectedList;
												newList[0].w = Math.floor(e.target.value);
												this.setState({ nw: e.target.value });
												this.context.selectComponent(
													this.context.list,
													newList
												);
											}
										}}
									/>
								</span>{" "}
								x{" "}
								<span>
									<input
										step="10"
										value={Math.floor(nh)}
										type="number"
										onChange={(e) => {
											if (Number.isInteger(parseInt(e.target.value))) {
												let newList = this.context.selectedList;
												newList[0].h = Math.floor(e.target.value);
												this.setState({ nh: e.target.value });
												this.context.selectComponent(
													this.context.list,
													newList
												);
											}
										}}
									/>
								</span>
							</>
						}
					</div>
				</div>
				<div
					className="screen responsive"
					ref={this.screen}
					style={{
						width: `${Math.floor(this.mainW > nw ? nw : this.mainW)}px`,
						height: `${Math.floor(this.mainH > nh ? nh : this.mainH)}px`,
					}}
				>
					{!link || link.length === 0 ? (
						<div className="msg flex flex-col ai-center jc-center">
							<span role="img" aria-label="logo">
								🔗
							</span>
							Enter a Website Link to View
						</div>
					) : (
						<iframe id="iframe" src={link} title={name} style={style} />
					)}
					{/* <div
						className="resize right"
						id="right"
						onMouseDown={this.mouseDown}
						onMouseUp={this.mouseUp}
						onMouseMove={this.mouseMove}
						onMouseOut={() => {
							this.moR = false;
							this.moD = false;
						}}
					>
						{">"}
					</div>
					<div
						className="resize down"
						id="down"
						onMouseDown={this.mouseDown}
						onMouseUp={this.mouseUp}
						onMouseMove={this.mouseMove}
						// onMouseOut={() => {
						// 	this.moR = false;
						// 	this.moD = false;
						// }}
					>
						^
					</div> */}
				</div>
			</>
		);
	}
}

//for draggable resizing
/*mouseDown = (e) => {
	let cur = e.target;
	console.log("mouse down");
	if (cur.classList.contains("right")) this.moR = true;
	else if (cur.classList.contains("down")) this.moD = true;
};

mouseUp = (e) => {
	let cur = e.target;
	console.log("mouse up");
	if (cur.classList.contains("right")) this.moR = false;
	else if (cur.classList.contains("down")) this.moD = false;
};

mouseMove = (e) => {
	let cur = e.target;
	let screen = this.screen.current.getBoundingClientRect();
	// console.log(cur);

	console.log("before", e.pageX, screen.right);
	if (cur.classList.contains("right")) {
		if (!this.moR) return;

		let newX = e.pageX;
		let oldX = screen.right;

		if (newX - oldX + 8 > 0) {
			// cur.style.right = `${oldX - newX}px`;
			console.log("right", (newX - oldX + 8) * 2);
			this.setState({ nw: this.state.nw + (newX - oldX + 8) * 2 });
		} else if (newX - oldX - 14 < 0) {
			this.setState({ nw: this.state.nw + (newX - oldX - 16) * 2 });
			// cur.style.right = `${newX - oldX}px`;
			console.log("left", (newX - oldX - 16) * 2);
		}

		// if (newX > oldX + 12 || newX < oldX - 28) this.moR = false;
	} else if (cur.classList.contains("down")) {
		if (!this.moD) return;
	}
	console.log("after", e.pageX, screen.right);
};*/
