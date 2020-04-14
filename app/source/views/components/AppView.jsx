import React from 'react';
import Container from '../../components/Container/Container';
import ExternalCamera from '../../containers/ExternalCamera';
import SelfCamera from '../../containers/SelfCamera';

const AppView = (props) => {
    return (
        <Container>
            <div className='mt-3'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md'>
                            <ExternalCamera />
                        </div>
                        <div className='col-md'>
                            <SelfCamera />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default AppView;
