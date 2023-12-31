import React from "react";
import FileSettings from "../../assets/filesetting1.svg"
import MoveIcon from "../../assets/filesetting4.svg";
import DeleteIcon from "../../assets/filesetting5.svg";
import SettingsIcon from "../../assets/filesetting3.svg";
import ShareIcon from "../../assets/filesetting2.svg"

class NewContextMenu extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            // settings__folder__margin
            <div onClick={this.props.stopPropagation} ref={this.props.wrapperRef} class={(this.props.parent === "/" || this.props.parent === undefined) ? "settings__drop" : "settings__drop"} style={this.props.contextSelected ? this.props.quickItemMode ? {display:"block", marginTop: '138px'} : {display:"block"} : {display:"none"}}>
                <ul>
                    <li><a onClick={this.props.startRenameFile} class="rename__file"><span><img src={FileSettings} alt="setting"/></span> Rename</a></li>
                    {!this.props.folderMode ? <li><a onClick={this.props.startShareFile} class="modal__button" data-modal="share__modal"><span><img src={ShareIcon} alt="setting"/></span> Share</a></li> : undefined}
                    {!this.props.folderMode ? <li><a onClick={this.props.startFileDownload}><span><img src={SettingsIcon} alt="setting"/></span> Download</a></li> : undefined}
                    <li><a onClick={this.props.startMovingFile} class="modal__button" data-modal="destination__modal"><span><img src={MoveIcon} alt="setting"/></span> Move</a></li>
                    <li><a onClick={this.props.startDeleteFile} class="delete__file"><span><img src={DeleteIcon} alt="setting"/></span> Delete</a></li>
                </ul>
		    </div>
        )
    }
}

export default NewContextMenu;