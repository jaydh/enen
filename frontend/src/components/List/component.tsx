import * as React from "react";
import { IArticle } from "../../reducers/articles";
import Article from "../Article";
import MaterialList from "@material-ui/core/List";

interface IProps {
  articles: IArticle[];
}

interface IState {
  expandedPanel: string;
}

class List extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { expandedPanel: "" };
    this.handleChange = this.handleChange.bind(this);
  }
  public render() {
    const { articles } = this.props;
    return (
      <MaterialList>
        {articles.map((t: IArticle) => (
          <Article
            key={t.id}
            expanded={this.state.expandedPanel === t.id}
            handler={this.handleChange(t.id, this.state.expandedPanel === t.id)}
            article={t}
          />
        ))}{" "}
      </MaterialList>
    );
  }

  private handleChange = (id: string, expanded: boolean) => (event: any) => {
    this.setState({
      expandedPanel: expanded ? "" : id
    });
  };
}

export default List;
