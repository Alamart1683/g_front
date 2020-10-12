import React from 'react';
import { Form, Tabs, Tab, Image } from 'react-bootstrap';
import { useAuthContext } from '../../auth/AuthContext';

import iconBell from '../../images/icons/bell.png';
import iconInfo from '../../images/icons/info.png';
import iconFind from '../../images/icons/find.png';
import iconDisc from '../../images/icons/disc.png';

export default function StudentInfoPage(){
    const { authTokens, setAuthTokens } = useAuthContext();

    return(
        <Form className='info-form light-background'>
            <Tabs defaultActiveKey='info1'>
                <Tab eventKey='info1' title={<Image src={iconBell} thumbnail/>}>
                    <div>
                        Контент <br></br>
                        Контент <br></br>
                        Контент <br></br>
                        Контент
                    </div>
                    <Tabs defaultActiveKey='info11'>
                        <Tab eventKey='info11' title='1'>
                            11
                        </Tab>
                        <Tab eventKey='info12' title='2' className='float-right'>
                            12
                        </Tab>
                    </Tabs>
                </Tab>
                <Tab eventKey='info2' title={<Image src={iconInfo} thumbnail/>}>
                    2
                </Tab>
                <Tab eventKey='info3' title={<Image src={iconFind} thumbnail />}>
                    3 
                </Tab>
                <Tab eventKey='info4' title={<Image src={iconDisc} thumbnail />}>
                    4
                </Tab>
            </Tabs>
            
        </Form>
        
    );
   
}