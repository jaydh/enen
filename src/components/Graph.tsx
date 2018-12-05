import {
  isSameDay,
  isSunday,
  isWithinRange,
  parse,
  subDays,
  subWeeks
} from 'date-fns';
import * as React from 'react';
import { connect } from 'react-redux';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from 'victory';

// tslint:disable:jsx-no-lambda
// tslint:disable:no-var-requires
// Broken typedef for legend
const { VictoryLegend } = require('victory');

interface IProps {
  completionDates: any;
  domains: {};
}

class Graph extends React.Component<IProps> {
  public render() {
    const { domains, completionDates } = this.props;
    const data = Object.keys(domains).map((key: string) => {
      return { domain: key, count: domains[key] };
    });
    const today = new Date();
    let runner = new Date();
    const dates = {};
    while (!isSameDay(runner, subWeeks(today, 4))) {
      dates[runner.toDateString()] = 0;
      runner = subDays(runner, 1);
    }
    // tslint:disable:no-console
    const inRange = completionDates
      .filter((t: Date) => isWithinRange(t, subWeeks(today, 4), today))
      .forEach((t: Date) => {
        dates[t.toDateString()] = dates[t.toDateString()] + 1;
      });
    console.log(inRange, dates);

    return (
      <>
        <VictoryLegend
          theme={VictoryTheme.material}
          x={125}
          y={10}
          title="Publication Distribution"
          centerTitle={true}
          orientation="horizontal"
          style={{ border: { stroke: 'black' }, title: { fontSize: 20 } }}
          data={[]}
        />
        <VictoryChart
          animate={{ duration: 500, easing: 'bounce' }}
          theme={VictoryTheme.material}
          padding={{ left: 200, top: 50, right: 10, bottom: 50 }}
        >
          <VictoryAxis dependentAxis={true} tickValues={Object.keys(domains)} />
          <VictoryBar
            labels={(d: any) => d.count}
            horizontal={true}
            data={data}
            y="count"
            x="domain"
            style={{
              data: {
                fillOpacity: 0.7,
                strokeWidth: 3
              },
              labels: {
                fontSize: 15
              }
            }}
          />
        </VictoryChart>
        <VictoryChart
          animate={{ duration: 500, easing: 'bounce' }}
          theme={VictoryTheme.material}
          padding={{ left: 200, top: 50, right: 10, bottom: 50 }}
        >
          <VictoryAxis
            dependentAxis={false}
            tickValues={Object.keys(dates).filter((t: string) =>
              isSunday(parse(t))
            )}
            style={{
              tickLabels: { fontSize: 20, padding: 30, angle: 45 } as any
            }}
          />
          <VictoryBar
            data={Object.keys(dates).map((t: string) => dates[t])}
            style={{
              data: {
                fillOpacity: 0.7,
                strokeWidth: 3
              },
              labels: {
                fontSize: 15
              }
            }}
          />
        </VictoryChart>
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    completionDates: state.articles.articles.map((t: any) =>
      parse(t.completedOn)
    ),
    domains: state.graphData.domains
  };
};

export default connect(mapStateToProps)(Graph);
