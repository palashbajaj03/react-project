import React, { Component } from 'react'
import { connect } from 'react-redux';
import { configureAction } from '../../actions'
import Tree from 'react-d3-tree';

class TeamHierarchy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      svgSquare: {
        shape: 'rect',
        shapeProps: {
          width: 220,
          height: 58,
          fill: '#fff',
          stroke: 'none',
          rx: 4,
          x: -10,
          y: -10,
          class: 'teamBox'
        }
      },
      myTreeData: [],
      zoom: 1
    }
  }
  componentDidMount() {
    const { client_id, emailid } = this.props.user
    this.props.loadOrganizationHierarchy(client_id, emailid)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hierarchy != this.props.hierarchy) {
      let heirarcyData = this.props.hierarchy && this.props.hierarchy
      let idToNodeMap = {}
      let rootArray = null
      let parentNode = []

      for (var dataIndex = 0; dataIndex < heirarcyData.length; dataIndex++) {
        var datum = heirarcyData[dataIndex];
        datum.children = [];
        idToNodeMap[datum.rep_id] = datum;
        if (datum.manager_id === null) {
          rootArray = datum;
          rootArray.name = datum.name;
        } else {
          parentNode = idToNodeMap[datum.manager_id];
          datum.name = datum.name;
          parentNode.children.push(datum);
        }
      }

      let myTreeData = [{
        ...rootArray
      }]

      this.setState(({ myTreeData }))
    }
  }

  zoomOut = () => {
    if (this.state.zoom > 0.5)
      this.setState((prevState) => ({
        zoom: (prevState.zoom - 0.1).toFixed(1)
      }))
  }

  zoomIn = () => {
    if (this.state.zoom < 1)
      this.setState((prevState) => ({
        zoom: (parseFloat(prevState.zoom) + 0.1).toFixed(1)
      }))

  }

  render() {
    return (
      <div className="teamTab" id="teamTab">
        <div className="page-title-row">
          <div className="page-title-box">
            <h2 className="page-title"> Team Hierarchy </h2>
            <div className="page-breadcum">
              <p><a href="#">Configuration </a> > Team Hierarchy </p>
            </div>
          </div>
          <div className="sizeBtn">
            <button onClick={this.zoomIn}><i className="icon-curated-plus"></i></button>
            <button onClick={this.zoomOut}> <i className="icon-curated-minus"></i></button>
          </div>
        </div>
        <div id="treeWrapper" style={{ width: '100%', height: '700px' }}>
          {this.state.myTreeData.length > 0 && <Tree
            zoom={this.state.zoom}
            translate={{ x: 600, y: 120 }}
            scaleExtent={{ min: 0.5, max: 1 }}
            data={this.state.myTreeData}
            textLayout={{ x: 16, y: 18 }}
            orientation="vertical"
            separation={{ siblings: 1.7, nonSiblings: 1.8 }}
            nodeSvgShape={this.state.svgSquare} />}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  hierarchy: state.configureReducer.organization_hierarchy
})

const mapActionToProps = {
  loadOrganizationHierarchy: configureAction.loadOrganizationHierarchy
}

export default connect(mapStateToProps, mapActionToProps)(TeamHierarchy)