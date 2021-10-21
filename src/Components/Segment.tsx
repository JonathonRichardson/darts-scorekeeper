import * as React from "react";

export type ISegmentType = "Inner" | "Treble" | "Outer" | "Double" | "Label";

// Measurements are in mm from https://www.dlgsc.wa.gov.au/sport-and-recreation/sports-dimensions-guide/darts
const TREBLE_AND_DOUBLE_WIDTH = 8;
export const BULL_INSIDE_DIAMETER = 12.7;
export const OUTER_BULL_INSIDE_DIAMETER = 31.8;
const CENTER_BULL_TO_INSIDE_EDGE_OF_TREBLE_WIRE = 95; //107;
const CENTER_BULL_TO_OUTSIDE_EDGE_OF_DOUBLE_WIRE = 170;
export const OVERALL_BOARD_DIAMETER = 451;

interface ISegmentMeasurementInfo {
  innerRadius: number;
  outerRadius: number;
  evenColor: string;
  oddColor: string;
}

const SegmentInfo: Record<ISegmentType, ISegmentMeasurementInfo> = {
  Inner: {
    innerRadius: OUTER_BULL_INSIDE_DIAMETER / 2,
    outerRadius: CENTER_BULL_TO_INSIDE_EDGE_OF_TREBLE_WIRE,
    evenColor: "White",
    oddColor: "Black"
  },
  Treble: {
    innerRadius: CENTER_BULL_TO_INSIDE_EDGE_OF_TREBLE_WIRE,
    outerRadius:
      CENTER_BULL_TO_INSIDE_EDGE_OF_TREBLE_WIRE + TREBLE_AND_DOUBLE_WIDTH,
    evenColor: "Green",
    oddColor: "Red"
  },
  Outer: {
    innerRadius:
      CENTER_BULL_TO_INSIDE_EDGE_OF_TREBLE_WIRE + TREBLE_AND_DOUBLE_WIDTH,
    outerRadius:
      CENTER_BULL_TO_OUTSIDE_EDGE_OF_DOUBLE_WIRE - TREBLE_AND_DOUBLE_WIDTH,
    evenColor: "White",
    oddColor: "Black"
  },
  Double: {
    innerRadius:
      CENTER_BULL_TO_OUTSIDE_EDGE_OF_DOUBLE_WIRE - TREBLE_AND_DOUBLE_WIDTH,
    outerRadius: CENTER_BULL_TO_OUTSIDE_EDGE_OF_DOUBLE_WIRE,
    evenColor: "Green",
    oddColor: "Red"
  },
  Label: {
    innerRadius: CENTER_BULL_TO_OUTSIDE_EDGE_OF_DOUBLE_WIRE,
    outerRadius: OVERALL_BOARD_DIAMETER / 2,
    evenColor: "White",
    oddColor: "Black"
  }
};

export type IDartValue =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20";

export const DART_VALUE_ORDER: IDartValue[] = [
  "20",
  "1",
  "18",
  "4",
  "13",
  "6",
  "10",
  "15",
  "2",
  "17",
  "3",
  "19",
  "7",
  "16",
  "8",
  "11",
  "14",
  "9",
  "12",
  "5"
];

interface IProps {
  clickable: boolean;
  segmentType: ISegmentType;
  value: IDartValue;
  onSegmentClick?: (info: {
    type: ISegmentType;
    value: IDartValue | "Bull";
  }) => void;
}

interface IState {}

const calcXCoordinate = (angleInDegrees: number, radius: number) => {
  return Math.cos((angleInDegrees * Math.PI) / 180) * radius;
};

const calcYCoordinate = (angleInDegrees: number, radius: number) => {
  return Math.sin((angleInDegrees * Math.PI) / 180) * radius;
};

export class Segment extends React.Component<IProps, IState> {
  render() {
    let measurements = SegmentInfo[this.props.segmentType];

    let segmentWidth = 360 / DART_VALUE_ORDER.length;
    let segmentNumber = DART_VALUE_ORDER.indexOf(this.props.value);

    let angleOrigin = 270 + segmentWidth - segmentWidth / 2;
    let startAngle = angleOrigin + (segmentNumber - 1) * segmentWidth;
    let endAngle = startAngle + segmentWidth;

    let color =
      segmentNumber % 2 === 0 ? measurements.evenColor : measurements.oddColor;

    if (this.props.segmentType == "Label") {
      color = "Black";
    }

    let outerR = measurements.outerRadius;
    let startX = calcXCoordinate(startAngle, outerR);
    let startY = calcYCoordinate(startAngle, outerR);

    let firstArcEndX = calcXCoordinate(endAngle, outerR);
    let firstArcEndY = calcYCoordinate(endAngle, outerR);

    let innerR = measurements.innerRadius;
    let secondArcStartX = calcXCoordinate(endAngle, innerR);
    let secondArcStartY = calcYCoordinate(endAngle, innerR);

    let secondArcEndX = calcXCoordinate(startAngle, innerR);
    let secondArcEndY = calcYCoordinate(startAngle, innerR);

    const pathData = [
      `M ${startX} ${startY}`,
      `A ${outerR} ${outerR} 0 0 1 ${firstArcEndX} ${firstArcEndY}`,
      `L ${secondArcStartX} ${secondArcStartY}`,
      `A ${innerR} ${innerR} 0 0 0 ${secondArcEndX} ${secondArcEndY}`
    ].join(" ");

    return (
      <>
        <path
          className={`${
            this.props.clickable && this.props.segmentType !== "Label"
              ? "clickable"
              : ""
          }`}
          onClick={() => {
            if (this.props.onSegmentClick) {
              this.props.onSegmentClick({
                type: this.props.segmentType,
                value: this.props.value
              });
            }
          }}
          d={pathData}
          stroke="black"
          fill={color}
        />
        {this.props.segmentType === "Label" && (
          <>
            {(() => {
              // Center the text in the middle of the segment
              let textAngle = (startAngle + endAngle) / 2;
              let textRadius = (innerR + outerR) / 2;

              let fontSize = 40;

              return (
                <text
                  x={calcXCoordinate(textAngle, textRadius)}
                  // Not sure why this adjustment is necessary, but it works
                  y={calcYCoordinate(textAngle, textRadius) + fontSize * 0.3}
                  color="white"
                  fill="white"
                  stroke="white"
                  fontSize={fontSize}
                  textAnchor="middle"
                  //transform="rotate(90)"
                >
                  {this.props.value}
                </text>
              );
            })()}
          </>
        )}
      </>
    );
  }
}
