import React from 'react';
import { XYPlot, HorizontalGridLines, VerticalRectSeries, XAxis, Hint, RectSeriesPoint } from 'react-vis';
import 'react-vis/dist/style.css';

type Props = {
  data: Array<[string, number]>
  title: string
}

export function Histogram(props: Props) {
  const [hover, setHover] = React.useState<RectSeriesPoint | null>(null);
  const { data, title } = props;

  const formattedData = Object.values(data).reduce((acc, [systemName, systemInfluence]) => {
    const y0 = acc.filter(({ x0 }) => x0 === systemInfluence - 0.5).length;
    return [...acc, { x0: systemInfluence - 0.5, y0, x: systemInfluence + 0.5, y: y0 + 1, systemName }]
  }, [] as RectSeriesPoint[])

  console.log(formattedData);

  return (
    <div>
      <h2>{title}</h2>
      <XYPlot
        width={500}
        height={300}
      >
        <HorizontalGridLines />
        <VerticalRectSeries
          style={{
            fill: 'var(--primary)',
            stroke: 'var(--primary-dark)',
          }}
          data={formattedData}
          onValueMouseOver={setHover}
          onValueMouseOut={() => setHover(null)}
        />
        <XAxis tickFormat={val => Math.round(val) === val ? val : ""} title="Influence" />
        {hover && <Hint value={hover}>
          <div style={{ background: 'var(--primary)', outline: '2px solid var(--primary-dark)' }}>
            <h3>{hover.systemName}</h3>
          </div>
        </Hint>}
      </XYPlot>
    </div>
  );
}