import React from 'react';
import logo from '../assets/logo.png'

function Loading(props) {
    return (
        <div className='container' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '90vh' }}>
            <img src={logo} alt="" style={{ width: '40%' }} className='logo_loading' />
        </div>
    );
}
// <ReactLoading type={'bars'} color={'#fff'} height={0} width={'30%'} />
export default Loading;