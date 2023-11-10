import React from "react";
import axios from "../../axiosInterceptor";
import Swal from "sweetalert2";
import VerifyEmailPage from "./VerifyEmailPage";
import { withRouter } from "../../routers/utils";

class VerifiyEmailPageContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            verified: false,
            error: false,
        }
    }


    componentDidMount = () => {
        this.checkEmailVerification();
    }

    checkEmailVerification = () => {
        const id = this.props.params.id

        if (id) {

            const data = {
                emailToken: id
            }

            axios.get(`/user-service/verify-email/${id}`, data).then((response) => {
            
                this.setState(() => {
                    return {
                        ...this.state,
                        verified: true,
                        error: false
                    }
                })

                Swal.fire(
                    'Email Address Verified',
                    'You Have Successfully verified your email address, you may now log into myDrive.',
                    'success'
                  )

            }).catch((err) => {
              
                this.setState(() => {
                    return {
                        ...this.state,
                        error: true
                    }
                })

                Swal.fire(
                    'Email Address Verifation Error',
                    'Could Not Verifiy Email Address',
                    'error'
                  )
            })
        }
    }

    render() {

        return <VerifyEmailPage 
                    state={this.state}/>
    }
}

export default withRouter(VerifiyEmailPageContainer);