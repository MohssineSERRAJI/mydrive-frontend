import QuickAccess from "./QuickAccess";
import {connect} from "react-redux";
import React from "react";
import { startSetQuickFiles } from "../../actions/quickFiles";

class QuickAccessContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount (){
        this.props.dispatch(startSetQuickFiles())
    }

    render() {
        return <QuickAccess {...this.props}/>
    }

}

const connectStateToProp = (state) => ({
    quickFiles: state.quickFiles,
    currentRouteType: state.main.currentRouteType
})

export default connect(connectStateToProp)(QuickAccessContainer)