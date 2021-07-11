import React, { useContext, useState, useEffect } from "react";
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
                        text={`${
                            reload
                                ? "Reload on Viewport change"
                                : "Do not reload"
                        }`}
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
                    style={{
                        backgroundColor: turned ? "lightgrey" : "transparent",
                    }}
                >
                    <img src={require("../rotate.svg")} alt="rotate" />
                    <ToolTip
                        text={`${turned ? "See Portrait" : "See Landscape"}`}
                    />
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

export function ResponsiveScreen({
    reload,
    changeReload,
    parentScreen,
    active,
}) {
    const context = useContext(Context);
    const [size, setSize] = useState({
        nh: context.selectedList[active].h,
        nw: context.selectedList[active].w,
    });

    const mainH = parentScreen.current.clientHeight - 108;
    const mainW = parentScreen.current.clientWidth - 108;
    const screen = React.createRef();

    /* eslint-disable */
    useEffect(() => {
        setSize({
            nh: context.selectedList[active].h,
            nw: context.selectedList[active].w,
        });
    }, []);
    /* eslint-enable */

    const { nh, nw } = size;
    const name = context.selectedList[active].name;
    const link = context.link;
    let r1 = mainW / nw;
    let r2 = mainH / nh;

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
        style.height = `${nh > mainH ? nh * (r2 / r1) : nh / r1}px`;
        style.transform = `scale(${r1})`;
    } else if (mini === 1) {
        // console.log("Height Ratio SMaller");
        style.height = `${nh}px`;
        style.width = `${nw > mainW ? nw * (r1 / r2) : nw / r2}px`;
        style.transform = `scale(${r2})`;
    }

    /* eslint-disable */
    useEffect(() => {
        function handleResize(e) {
            const { width, height } = e[0].target.style;
            setSize({
                nw: width.substr(0, width.length - 2),
                nh: height.substr(0, height.length - 2),
            });
        }
        const node = screen.current;
        new ResizeObserver(handleResize).observe(node);
    }, []);
    /* eslint-enable */

    return (
        <>
            <div className="title flex ai-center jc-center">
                <div
                    className="reload"
                    onClick={changeReload}
                    style={{
                        backgroundColor: reload ? "grey" : "transparent",
                    }}
                >
                    <span role="img" aria-label="reload">
                        🔄
                    </span>
                    <ToolTip
                        text={`${
                            reload
                                ? "Reload on Viewport change"
                                : "Do not reload"
                        }`}
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
                                        if (
                                            Number.isInteger(
                                                parseInt(e.target.value)
                                            )
                                        ) {
                                            let newList = context.selectedList;
                                            newList[0].w = Math.floor(
                                                e.target.value
                                            );
                                            setSize({
                                                ...size,
                                                nw: e.target.value,
                                            });
                                            context.selectComponent(
                                                context.list,
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
                                        if (
                                            Number.isInteger(
                                                parseInt(e.target.value)
                                            )
                                        ) {
                                            let newList = context.selectedList;
                                            newList[0].h = Math.floor(
                                                e.target.value
                                            );
                                            setSize({
                                                ...size,
                                                nh: e.target.value,
                                            });
                                            context.selectComponent(
                                                context.list,
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
                ref={screen}
                style={{
                    width: `${Math.floor(mainW > nw ? nw : mainW)}px`,
                    height: `${Math.floor(mainH > nh ? nh : mainH)}px`,
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
            </div>
        </>
    );
}
