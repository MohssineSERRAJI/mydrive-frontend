import DownloadPage from "./DownloadPage";
import capitalize from "../../utils/capitalize";
import axios from "../../axiosInterceptor";
import bytes from "bytes";
import React from "react";
import { withRouter } from "../../routers/utils";

class DownloadPageContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
                error: false,
                title: "",
                type: "",
                size: "",
            }

        this.isPersonalFile = false;
    }

    getFileExtension = (filename) => {

        const filenameSplit = filename.split(".");

        if (filenameSplit.length > 1) {
            
            const extension = filenameSplit[filenameSplit.length - 1]

            return extension.toUpperCase();

        } else {

            return "Unknown"
        }
        
    }

    componentDidMount = () => {

        const tempToken = this.props.params.tempToken

        axios.get(`/file-service/public/info/${tempToken}`).then((results) => {
           const data = results.data;

           const title = capitalize(data[0].fields.filename);
           const size = bytes(data.length);
           const type = this.getFileExtension(title);

           this.setState(() => ({
               ...this.state,
                title, 
                type,
                size
           }))
            
        }).catch((err) => {
            console.log(err)
            this.setState(() => ({...this.state, error: true}))
        })
    }

    download = () => {
        const tempToken = this.props.params.tempToken
        axios.get(`/file-service/public/download/${tempToken}`).then((results)=>{
            const finalUrl = results.data.url   
            
            const link = document.createElement('a');
            document.body.appendChild(link);
            link.href = finalUrl;
            link.setAttribute('type', 'hidden');
            link.click();
        })
    }

    render() {

        return <DownloadPage state={this.state} download={this.download} {...this.props}/>
    }
}

export default withRouter(DownloadPageContainer);