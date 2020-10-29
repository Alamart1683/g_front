import React, { useState } from 'react';
import { Accordion, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';

export default function HocDocumentooborotPage() {

    const { authTokens } = useAuthContext();

    // Приказ НИР
    const [ nirPrikazNumber, setNirPrikazNumber ] = useState('');
    const [ nirPrikazDate, setNirPrikazDate ] = useState('');
    const [ nirPrikazStartDate, setNirPrikazStartDate ] = useState('');
    const [ nirPrikazEndDate, setNirPrikazEndDate ] = useState('');
    const [ nirPrikazSpeciality, setNirPrikazSpeciality ] = useState('');

    var fileNirPrikaz;

    $(function () {

        $('#content-button-01').off().on('click', function (event) {
            $('.hoc-documentooborot-content').removeClass('hoc-documentooborot-content-selected');
            $('#content-01').addClass('hoc-documentooborot-content-selected');
        });

        $('#content-button-02').off().on('click', function (event) {
            $('.hoc-documentooborot-content').removeClass('hoc-documentooborot-content-selected');
            $('#content-02').addClass('hoc-documentooborot-content-selected');
        });

        $('#upload-nir-prikaz').off().on('click', function(event) {
            if (fileNirPrikaz !== null && fileNirPrikaz !== undefined) {
                console.log('upload');
                
                axios({
                    url: apiURL + '/head_of_cathedra/document/order/upload',
                    method: 'POST',
                    responseType: 'blob',
                    params: {
                        'documentFormType': 'Научно-исследовательская работа',
                        'documentFormKind': 'Приказ',
                        'documentFormDescription': 'Приказ о выходе на НИР',
                        'documentFormViewRights': 'Все пользователи',
                        'number': nirPrikazNumber,
                        'orderDate': nirPrikazDate,
                        'startDate': nirPrikazStartDate,
                        'endDate': nirPrikazEndDate,
                        'speciality': nirPrikazSpeciality,
                        'file': fileNirPrikaz,
                    },
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken 
                    },
                  }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'Отчёт по НИР.docx');
                    document.body.appendChild(link);
                    link.click();
                    
                  }).catch(result => {
                    console.log(result.data);
                });
            }
            else {
                console.log('upload error nir prikaz');
            }
        });

    });

    return (
        <div className='hoc-documentooborot-div'>
            <div className='hoc-documentooborot-side-div light-background'>
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0" className='dark size-28'>
                            НИР
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <button type='button' id='content-button-01' className='dark size-24 hoc-documentooborot-menu-button'>Приказ об организации практики</button>
                                <button type='button' id='content-button-02' className='dark size-24 hoc-documentooborot-menu-button'>Шаблон задания</button>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="1" className='dark size-28'>
                            ПпППУиОПД
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>

                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="2" className='dark size-28'>
                            ПП
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="2">
                            <Card.Body>

                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="3" className='dark size-28'>
                            ВКР
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="3">
                            <Card.Body>

                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>

            <div id='content-start' className='light-background hoc-documentooborot-content hoc-documentooborot-content-selected'>

            </div>

            <div id='content-01' className='light-background hoc-documentooborot-content'>
                <div className='info-row'>
                    <div className='info-column'>
                        <Form.Label column className="size-21 dark info-input-label">Номер приказа:</Form.Label>
                        <input value={nirPrikazNumber} onChange={(e) => { setNirPrikazNumber(e.target.value);}} className='dark size-24 hoc-documentooborot-input' />

                        <Form.Label column className="size-21 dark info-input-label">Дата приказа:</Form.Label>
                        <input value={nirPrikazDate} onChange={(e) => { setNirPrikazDate(e.target.value);}} className='dark size-24 hoc-documentooborot-input' />

                        <Form.Label column className="size-21 dark info-input-label">Направление:</Form.Label>
                        <input value={nirPrikazSpeciality} onChange={(e) => { setNirPrikazSpeciality(e.target.value);}} className='dark size-24 hoc-documentooborot-input' />
                    </div>

                    <div className='info-column'>
                        <Form.Label column className="size-21 dark info-input-label">Дата начала НИР:</Form.Label>
                        <input value={nirPrikazStartDate} onChange={(e) => { setNirPrikazStartDate(e.target.value);}} className='dark size-24 hoc-documentooborot-input' />

                        <Form.Label column className="size-21 dark info-input-label">Дата конца НИР</Form.Label>
                        <input value={nirPrikazEndDate} onChange={(e) => { setNirPrikazEndDate(e.target.value);}} className='dark size-24 hoc-documentooborot-input' />

                    </div>
                </div>
                <div className='centered' style={{marginTop: '20px'}}>
                    <input type="file" id="fileNirPrikaz" accept='.docx, .pdf' className="info-input-file-hidden"
                        onChange={e => {
                            if (e.target.files.length !== 0) {
                                console.log(e.target.files[0].type);
                                if (e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                                    e.target.files[0].type === 'application/pdf') {
                                    fileNirPrikaz = e.target.files[0];
                                    document.getElementById('fileNirName').innerHTML = 'Файл выбран';
                                }
                                else {
                                    fileNirPrikaz = null;
                                    document.getElementById('fileNirName').innerHTML = 'Ошибка загрузки файла!';
                                }
                            }
                        }}
                    />
                    <label htmlFor="fileNirPrikaz" className='size-30 dark-background light info-file-label1'>
                        <p id='fileNirName' style={{ display: 'inline-block' }}>Выбрать файл приказа</p>
                    </label>
                    <button type='button' id='upload-nir-prikaz' className='size-30 light dark-background info-button-inline-block'>
                        <p>Загрузить приказ</p>
                    </button>
                    <p id='errorNirMessage' className='size-24 dark' style={{ visibility: 'hidden' }}>errorNir</p>
                </div>
            </div>
            <div id='content-02' className='light-background hoc-documentooborot-content'>
                content02
            </div>
        </div>
    );

}