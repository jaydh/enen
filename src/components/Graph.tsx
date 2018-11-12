import * as React from 'react';
import { connect } from 'react-redux';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from 'victory';

// tslint:disable:jsx-no-lambda
// tslint:disable:no-var-requires
// Broken typedef for legend
const { VictoryLegend } = require('victory');

interface IProps {
  domains: {};
}

class Graph extends React.Component<IProps> {
  public render() {
    const { domains } = this.props;
    const data = Object.keys(domains).map((key: string) => {
      return { domain: key, count: domains[key] };
    });

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
          <VictoryAxis dependentAxis={true} tickFormat={Object.keys(domains)} />
          <VictoryBar
            labels={d => d.count}
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
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    domains: state.graphData.domains
  };
};

export default connect(mapStateToProps)(Graph);
