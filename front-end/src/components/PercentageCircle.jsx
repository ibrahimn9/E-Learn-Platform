import React, { useState, useEffect } from "react";

const PercentageCircle = ({
  circleSize = 168,
  percent = 67,
  duration = 1000,
  offset = 100,
  fontColor = 'rgba(0,0,0,.5)',
  circleColor = '#30b37e',
  circleInnerColor = '#d9f5ea',
  circleThickness = 100
}) => {
  const [percentText, setPercentText] = useState(0);

  useEffect(() => {
    const divide = duration / percent;
    const unit = Math.ceil(offset / divide);
    const time = percent > 0 ? divide * unit : 0;

    if (time) {
      const addPer = () => {
        setTimeout(() => {
          const newPercentText = percentText + unit > percent ? percent : percentText + unit;
          setPercentText(newPercentText);
          if (newPercentText < percent) {
            addPer();
          }
        }, time);
      };
      addPer();
    }

    return () => clearTimeout();
  }, [percent, percentText, duration, offset]);

  const viewbox = `0 0 ${circleSize} ${circleSize}`;
  const strokeWidth = 14 * (circleThickness / 100);
  const diameter = circleSize - strokeWidth;
  const radius = diameter / 2;
  const circumference = 2 * Math.PI * radius;
  const fakePercent = percent === 98 || percent === 99 ? 97 : percent;
  const pCircumference = (circumference * fakePercent) / 100;
  const x = circleSize / 2;
  const y = (circleSize - diameter) / 2;
  const fontSize = circleSize / 3.73;
  const textX = circleSize / 2 - fontSize / 1.8;

  const d = `
    M ${x} ${y}
    a ${radius} ${radius} 0 0 1 0 ${diameter}
    a ${radius} ${radius} 0 0 1 0 ${diameter * -1}
  `;

  

  return (
    <div
      id="progress"
      style={{
        position: 'relative',
        width: circleSize,
        height: circleSize,
      }}
    >
      <svg viewBox={viewbox} stroke={circleColor}>
        <path
          style={{
            fill: 'none',
            stroke: circleInnerColor,
            strokeWidth,
          }}
          d={d}
        />
        {percent && (
          <path
            style={{
              fill: 'none',
              strokeWidth,
              strokeLinecap: 'square',
              animation: `progress${circleSize} ${duration}ms ease-out forwards`,
            }}
            d={d}
            strokeDasharray={[pCircumference, circumference]}
          />
        )}
      </svg>
    </div>
  );
};

export default PercentageCircle;
