import React, {useEffect} from 'react';

import { ToastContainer, toast } from 'react-toastify';
import {useMessage} from "@/context/useMessage";

function Alerts(){
    const {message,typeMessage,open}=useMessage()
    useEffect(() => {
        if (message!==null&&open){
            toast(  <div style={{  fontSize: '0.9rem' }}>
                {message}
            </div>, {type:typeMessage,});
        }
    }, [message]);

    return (
        <div>
            {/*<button onClick={notify}>Notify!</button>*/}
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                // className={'toastify-font'}
                rtl
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}
export default Alerts;