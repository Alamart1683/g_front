import React, { useState } from 'react';
import { Form, Tabs, Tab, Image } from 'react-bootstrap';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import axios from 'axios';
import $ from 'jquery';


import infoBlock1 from '../../images/infographics blocks/block1_0.png';
import infoBlock2 from '../../images/infographics blocks/block2_0.png';
import infoBlock3 from '../../images/infographics blocks/block3_0.png';
import infoBlock4 from '../../images/infographics blocks/block4_0.png';
import infoBlock11 from '../../images/infographics blocks/block1.png';
import infoBlock22 from '../../images/infographics blocks/block2.png';
import infoBlock33 from '../../images/infographics blocks/block3.png';
import infoBlock44 from '../../images/infographics blocks/block4.png';

export default function StudentInfoPage(){

    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    // Даты этапов
    const [nirStart, setNirStart] = useState('Приказ не вышел');
    const [nirEnd, setNirEnd] = useState('Приказ не вышел');
    const [longPpStart, setLongPpStart] = useState('Приказ не вышел');
    const [longPpEnd, setLongPpEnd] = useState('Приказ не вышел');
    const [ppStart, setPpStart] = useState('Приказ не вышел');
    const [ppEnd, setPpEnd] = useState('Приказ не вышел');
    const [vkrStart, setVkrStart] = useState('Приказ не вышел');
    const [vkrEnd, setVkrEnd] = useState('Приказ не вышел');

    if (!fetchedData) {
        setFetchedData(true);
        getDates();
    }

    function getDates() {
        axios({
            url: apiURL + '/date/all',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            //console.log(response);
            setNirStart(response.data.nirStart);
            setNirEnd(response.data.nirEnd);
            setLongPpStart(response.data.ppppuipdStart);
            setLongPpEnd(response.data.ppppuipdEnd);
            setPpStart(response.data.ppStart);
            setPpEnd(response.data.ppEnd);
            setVkrStart(response.data.vkrStart);
            setVkrEnd(response.data.vkrEnd);
        }).catch(result => {
            console.log(result.data);
        });
    }

    return(
        <Form className='info-form light-background'>
            <Tabs defaultActiveKey='info1' className='info-form-main-tabs' onSelect={(firstTab) => {
                    $('#image1').attr('src', infoBlock1);
                    $('#image2').attr('src', infoBlock2);
                    $('#image3').attr('src', infoBlock3);
                    $('#image4').attr('src', infoBlock4);
                    console.log(firstTab);
                    switch(firstTab) {
                        case 'info1':
                            $('#image1').attr('src', infoBlock11);
                            break;
                        case 'info2':
                            $('#image2').attr('src', infoBlock22);
                            break;
                        case 'info3':
                            $('#image3').attr('src', infoBlock33);
                            break;
                        case 'info4':
                            $('#image4').attr('src', infoBlock44);
                            break;
                        default:
                            console.log('tabError');
                    }
                }}>
                <Tab eventKey='info1'  title={<Image id='image1' src={infoBlock11} thumbnail className='info-form-image' style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}} />} className='info-form-tabs'>
                    <div className='dark info-text-block'>
                        <p className='size-24 info-text-block-title'>НАУЧНО-ИССЛЕДОВАТЕЛЬСКАЯ РАБОТА</p>
                        <div>
                            <p id='NIRStart' className='size-20 info-text-block-start-date'><b>Начало: {nirStart}</b></p>
                            <p id='NIREnd' className='size-20 info-text-block-end-date'><b>Конец: {nirEnd}</b></p>
                        </div>
                        <div style={{clear: 'both'}}></div>
                        <div className='size-20 info-text-block-content'>
                            Для того, чтобы студент мог приступить к выполнению НИР, ему необходимо<br/>
                            найти себе научного руководителя, с которым ему в дальнейшем предстоит<br/>
                            работать  на протяжении всего года.<br/>
                            Начало и прохождение научно-исследовательской работы регламентируется<br/>
                            приказом о выходе студентов на НИР.<br/>
                            Содержательным началом научно-исследовательской работы является<br/>
                            задание на НИР, которое должно быть утверждено (подписано) заведующим<br/>
                            кафедрой.<br/>
                            Первая часть научно-исследовательской работы состоит из:<br/>
                            1) Определения направления ВКР<br/>
                            2) Исследования существующих аналогов возможного программного продукта<br/>
                            3) Выбора темы с указанием её актуальности<br/>
                            4) Формулирования темы ВКР к середине ноября<br/>
                            Вторая часть научно-исследовательской работы состоит из:<br/>
                            1) Проведения анализа средств проектирования<br/>
                            2) Выбора архитектуры предполагаемого продукта<br/>
                            Третья часть научно-исследовательской работы состоит из:<br/>
                            1) Анализа инструментов и технологий реализации ПП<br/>
                            2) Написания отчёта по научно-исследовательской работе<br/>
                            Результатом выполнения НИР является отчёт, который должен содержать в себе:<br/>
                            1) Формулировку темы<br/>
                            2) Обоснование актуальности темы<br/>
                            3) Результаты всех анализов в виде таблиц<br/>
                            По итогу выполнения НИР студент получает зачёт после проверки отчёта.<br/>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey='info2' title={<Image id='image2' src={infoBlock2} thumbnail className='info-form-image' style={{borderTopLeftRadius:'0px', borderTopRightRadius:'0px',borderBottomRightRadius:'0px',borderBottomLeftRadius:'0px'}}/>}>
                    <div className='dark info-text-block' style={{backgroundColor:'#89AFE0'}}>
                        <p className='size-24 info-text-block-title'>ПРАКТИКА ПО ПОЛУЧЕНИЮ ПРОФЕССИОНАЛЬНЫХ УМЕНИЙ И ОПЫТА ПРОФЕССИОНАЛЬНОЙ ДЕЯТЕЛЬНОСТИ</p>
                        <div>
                            <p id='NIRStart' className='size-20 info-text-block-start-date'><b>Начало: {longPpStart}</b></p>
                            <p id='NIREnd' className='size-20 info-text-block-end-date'><b>Конец: {longPpEnd}</b></p>
                        </div>
                        <div style={{clear: 'both'}}></div>
                        <div className='size-20 info-text-block-content'>
                        Начало и прохождение практики по получению профессиональных<br/>
                        умений и опыта профессиональной деятельности регламентируется<br/>
                        приказом о выходе студентов на практику по получению<br/>
                        профессиональных умений и опыта профессиональной<br/>
                        деятельности.<br/>
                        Цель её проведения - это получение студентом профессиональных<br/>
                        навыков. В ходе её выполнения проводятся следующие действия:<br/>
                        1) Проектирование предполагаемого программного продукта<br/>
                        2) Проведение уточнения инструментов проектирования<br/>
                        3) Создание соответствующих моделей:<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;а) Функциональной<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;б) Процессной<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;в) Информационной<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;г) Интерфейсной<br/>
                        4) Оформление отчёта по данной практике<br/>
                        По итогу выполнения практики по получению профессиональных<br/>
                        умений и опыта профессиональной деятельности студент получает<br/> 
                        зачёт после проверки отчёта по данной работе.<br/>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey='info3' title={<Image id='image3' src={infoBlock3} thumbnail className='info-form-image' style={{borderTopLeftRadius:'0px', borderTopRightRadius:'0px',borderBottomRightRadius:'0px',borderBottomLeftRadius:'0px'}}/>}>
                    <div className='dark info-text-block' style={{backgroundColor:'#618FCA', color: '#F1F4FB'}}>
                        <p className='size-24 info-text-block-title'>ПРЕДДИПЛОМНАЯ ПРАКТИКА</p>
                        <div>
                            <p id='NIRStart' className='size-20 info-text-block-start-date'><b>Начало: {ppStart}</b></p>
                            <p id='NIREnd' className='size-20 info-text-block-end-date'><b>Конец: {ppEnd}</b></p>
                        </div>
                        <div style={{clear: 'both'}}></div>
                        <div className='size-20 info-text-block-content' style={{columnRuleColor: '#F1F4FB'}}>
                            Данная практика относится к реализации программного продукта. Её суть –<br/>
                            реализация спроектированного программного продукта студентом, на<br/>
                            основе полученных им в ходе выполнения предыдущей практики<br/>
                            профессиональных навыков и умений, а также анализа инструментов и<br/>
                            технологий реализации программного продукта и средств его<br/>
                            проектирования.<br/>
                            В ходе её проведения выполняются следующие действия:<br/>
                            1) Окончательное утверждение темы ВКР – тему нельзя будет изменить в<br/>
                            дальнейшем<br/>
                            2) Реализация спроектированного ранее программного продукта<br/>
                            3) Проведение отладки реализованного программного продукта<br/>
                            4) Оформление отчёта по данной практике<br/>
                            По итогу выполнения преддипломной практики студент получает<br/>
                            зачёт после проверки отчёта по данной работе.<br/>
                            Если студент не прошел практику (получил оценку<br/>
                            неудовлетворительно), к дальнейшей работе над ВКР и её защите<br/>
                            он не допускается.<br/>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey='info4' title={<Image id='image4' src={infoBlock4} thumbnail className='info-form-image' style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}}/>}>
                    <div className='dark info-text-block' style={{backgroundColor:'#3A5985', color: '#F1F4FB'}}>
                        <p className='size-24 info-text-block-title'>ПОДГОТОВКА И ЗАЩИТА ВКР</p>
                        <div>
                            <p id='NIRStart' className='size-20 info-text-block-start-date'><b>Начало: {vkrStart}</b></p>
                            <p id='NIREnd' className='size-20 info-text-block-end-date'><b>Конец: {vkrEnd}</b></p>
                        </div>
                        <div style={{clear: 'both'}}></div>
                        <div className='size-20 info-text-block-content' style={{columnRuleColor: '#F1F4FB'}}>
                            Данная фаза состоит из двух частей. В первой части студентом<br/>
                            совершаются действия по подготовке ВКР к сдаче, а именно:<br/>
                            1) Подготовка следующих документов:<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;а) Отзыва научного руководителя<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;б) Справки-допуска<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;в) Задания на ВКР<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;г) Заключения о прохождении проверки на антиплагиат<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;д) Презентации к защите ВКР<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;е) Расчётно-пояснительной записки<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;ж) Видеоролика с демонстрацией работы<br/>
                            2) Подтверждение работоспособности<br/>
                            3) Демонстрацию программного продукта<br/>
                            Все документы (отчёты) должны быть предоставлены не<br/>
                            менее чем за месяц до проведения защиты ВКР, быть<br/>
                            формальными и с тех пор более не изменяться.<br/>
                            Во второй части студент проходит защиту ВКР, для чего<br/>
                            выпускается соответствующий приказ. После прохождения<br/>
                            студентом предзащиты проходит защита перед<br/>
                            государственной комиссией, после которой студент<br/>
                            получает оценку за ВКР.<br/>
                        </div>
                    </div>
                </Tab>
            </Tabs>
            
        </Form>
        
    );
   
}