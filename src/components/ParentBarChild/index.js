import React from "react";
import Spacer from "../../assets/spacer.svg";

class ParentBarChild extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <span class="spacer__path">
          <img src={Spacer} alt="spacer" />
        </span>
        <p class="current__folder">{this.props.name}</p>
      </div>
    );
  }
}

export default ParentBarChild;
