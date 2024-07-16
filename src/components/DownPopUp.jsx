import React from 'react';
import { IoCloseOutline } from "react-icons/io5";

function DownPopUp({ children, closeHandler = () => { } }) {
    return (
        <div className='down_popup'>
            <div className="close">
                <IoCloseOutline color='#154264' onClick={closeHandler} size={24} />
            </div>
            {children}
        </div>
    );
}

export default DownPopUp;