import * as React from "react";
import {
  Segment,
  DART_VALUE_ORDER,
  ISegmentType,
  OUTER_BULL_INSIDE_DIAMETER,
  BULL_INSIDE_DIAMETER,
  OVERALL_BOARD_DIAMETER,
  IDartValue
} from "./Segment";

interface IProps {
  height?: string;
  width?: string;
  notClickable?: boolean;
  onSegmentClick?: (info: {
    type: ISegmentType;
    value: IDartValue | "Bull";
  }) => void;
}

interface IState {}

export class Dartboard extends React.Component<IProps, IState> {
  render() {
    let clickable = !this.props.notClickable;
    return (
      <svg
        height={this.props.height ? this.props.height : "100vh"}
        width={this.props.width ? this.props.width : "100vw"}
        viewBox="-250 -250 500 500"
        //style={{ transform: "rotate(-0.25turn)" }}
      >
        {/* <circle r="170" fill="black" />
        <circle r="162" fill="white" />
        <circle r="115" fill="black" /> */}
        {/* <circle
          r="53.5"
          fill="none"
          stroke="grey"
          strokeWidth="107"
          strokeDasharray="16.8 16.8"
          transform="rotate(-10)"
        /> */}
        {/*         
        <circle r={OVERALL_BOARD_DIAMETER / 2} fill="black" /> */}

        {/* Single Bull */}
        <circle r={OUTER_BULL_INSIDE_DIAMETER / 2} fill="green" onClick={() => {
          this.props.onSegmentClick && this.props.onSegmentClick({
            type: 'Outer',
            value: 'Bull',
          })
        }} />

        {/* Double Bull */}
        <circle r={BULL_INSIDE_DIAMETER / 2} fill="red" onClick={() => {
          this.props.onSegmentClick && this.props.onSegmentClick({
            type: 'Inner',
            value: 'Bull',
          })
        }}/>

        {/* {(() => {
          let outerR = 170 - 8;
          let startX = Math.cos((-9 * Math.PI) / 180) * outerR;
          let startY = Math.sin((-9 * Math.PI) / 180) * outerR;
  
          let firstArcEndX = Math.cos((9 * Math.PI) / 180) * outerR;
          let firstArcEndY = Math.sin((9 * Math.PI) / 180) * outerR;
  
          let innerR = 115;
          let secondArcStartX = Math.cos((9 * Math.PI) / 180) * innerR;
          let secondArcStartY = Math.sin((9 * Math.PI) / 180) * innerR;
  
          let secondArcEndX = Math.cos((-9 * Math.PI) / 180) * innerR;
          let secondArcEndY = Math.sin((-9 * Math.PI) / 180) * innerR;
  
          const pathData = [
            `M ${startX} ${startY}`,
            `A ${outerR} ${outerR} 0 0 1 ${firstArcEndX} ${firstArcEndY}`,
            `L ${secondArcStartX} ${secondArcStartY}`,
            `A ${innerR} ${innerR} 0 0 0 ${secondArcEndX} ${secondArcEndY}`
          ].join(" ");
  
          return (
            <path
              onClick={() => {
                alert(20);
              }}
              d={pathData}
              fill="orange"
              data-value="20"
            />
          );
        })()} */}
        {DART_VALUE_ORDER.map((value) => {
          return (
            <>
              {(["Inner", "Outer", "Treble", "Double", "Label"] as ISegmentType[]).map((type) => {
                return (
                  <Segment
                    value={value}
                    segmentType={type}
                    clickable={clickable}
                    onSegmentClick={this.props.onSegmentClick}
                  />
                );
              })}
            </>
          );
        })}
      </svg>
    );
  }
}
