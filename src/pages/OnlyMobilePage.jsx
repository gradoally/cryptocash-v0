import React from 'react';
import qr_code from '../assets/qr-code.gif'

function OnlyMobilePage(props) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15, alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h2 style={{ textAlign: 'center' }}>Leave the desktop. Mobile gaming rocks!</h2>
            <img src={qr_code} width="300" height="300" border="0" alt='' style={{ borderRadius: 20, overflow: 'hidden' }} />
        </div>
    );
}

export default OnlyMobilePage;