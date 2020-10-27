import React, { useState } from "react";
import Context from "../../Context";
import Tooltip from "../tooltip";

import "./searchbar.scss";

function validURL(str) {
	if (str.length === 0) return true;

	var pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
			"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
			"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
			"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
			"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
			"(\\#[-a-z\\d_]*)?$",
		"i"
	); // fragment locator
	/* eslint-disable */
	// prettier-ignore
	// var patternLocal = new RegExp("/^https?:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/");
	/* eslint-enable */
	let a = !!pattern.test(str);
	if (str.includes("localhost")) return true;
	return a;
}

const Searchbar = () => {
	const [link, changeLink] = useState("");
	const [isValid, checkValid] = useState(true);

	return (
		<Context.Consumer>
			{(context) => (
				<div className="searchbar">
					<div className="copyright">
						© 2020, Made with{" "}
						<span role="img" aria-label="heart">
							❤️
						</span>{" "}
						by {/*eslint-disable*/}
						<a
							href="https://tekhin3.netlify.app"
							target="_blank"
							className="td-none"
							style={{
								color: "#eb3e45",
								cursor: "pointer",
								fontWeight: "500",
							}}
						>
							tekhin
						</a>{" "}
						{/*eslint-enable*/}| Himanshu
					</div>
					<div
						className={`input flex jc-between ai-center ${
							!isValid ? "invalid" : ""
						} `}
						onKeyPress={(e) => {
							if (e.key === "Enter") {
								isValid ? context.updateLink(link) : e.preventDefault();
							}
						}}
					>
						<input
							placeholder="Enter Website Link"
							type="text"
							value={link}
							onChange={(e) => {
								changeLink(e.target.value);
								if (!validURL(e.target.value)) checkValid(false);
								else checkValid(true);
							}}
						/>

						<div
							className={`search flex jc-between ai-center ${
								!isValid ? "inactive" : ""
							}`}
							onClick={(e) =>
								isValid ? context.updateLink(link) : e.preventDefault()
							}
						>
							<svg
								viewBox="0 0 24 24"
								style={{
									display: "inline-block",
									color: "rgba(0, 0, 0, 0.87)",
									fill: "rgb(158, 158, 158)",
									height: "24px",
									width: "24px",
									userSelect: "none",
									transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0s",
									opacity: "1",
								}}
							>
								<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
							</svg>
						</div>
					</div>
					<div className="copy">
						Can test with {/*eslint-disable*/}
						<a
							href="https://tekhin3.netlify.app"
							target="_blank"
							className="td-none"
							style={{
								color: "#eb3e45",
								cursor: "pointer",
								fontWeight: "500",
							}}
						>
							https://tekhin3.netlify.app
						</a>{" "}
						{/*eslint-enable*/}
						<span
							role="img"
							aria-label="copy"
							onClick={() =>
								navigator.clipboard.writeText("https://tekhin3.netlify.app")
							}
						>
							📋
							<Tooltip text="Click to copy" />
						</span>
					</div>
				</div>
			)}
		</Context.Consumer>
	);
};

export default Searchbar;
