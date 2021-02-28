import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';
import { Image } from 'react-bootstrap';

import iconLookingGlass from '../../images/icons/lookingglass.png';
import iconMessage from '../../images/icons/msg.png';
import iconSent from '../../images/icons/sent.png';
import iconReceived from '../../images/icons/recieved.png';
import iconUnraveled from '../../images/icons/unraveled.png';
import iconDelete from '../../images/icons/delete.png';
import iconStudents from '../../images/icons/students.png';

export default function MessagesPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);

    const [sentMessages, setSentMessages] = useState([]);
    const [receivedMessages, setReceivedMessages] = useState([]);

    const [showCreate, setShowCreate] = useState(false);

    var newMessageReceiversId = [];

    useEffect(() => {
        showReceivedMessages(receivedMessages);
    }, [receivedMessages]);

    useEffect(() => {
        showSentMessages(sentMessages);
    }, [sentMessages]);

    if (!fetchedData) {
        setFetchedData(true);

        getSentMessages();
        getReceivedMessages()
    }

    function getSentMessages() {
        axios({
            url: apiURL + '/messages/get/sent',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            setSentMessages(response.data);
            //console.log(response.data);
        }).catch(result => {
            console.log(result.data);
        });
    }

    function getReceivedMessages() {
        axios({
            url: apiURL + '/messages/get/received',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authTokens.accessToken
            },
        }).then((response) => {
            setReceivedMessages(response.data);
            //console.log(response.data);
        }).catch(result => {
            console.log(result.data);
        });
    }

    function showReceivedMessages(messageArray) {
        for (var i = messageArray.length - 1; i >= 0; i--) {
            var message = messageArray[i];
            //console.log(message);

            var isRead = false;
            for (var j = 0; j < message.receivers.length; j++) {
                if (message.receivers[j].email === authTokens.email && message.isRedList[j] === 1) {
                    isRead = true;
                }
            }

            var smallMessageDiv = document.createElement('div');
            if (!isRead) {
                smallMessageDiv.className = 'message-compact-div dark-background light compact-received-unread';
            }
            else {
                smallMessageDiv.className = 'message-compact-div dark-background light';
            }
            smallMessageDiv.id = 'compact-received-' + i;

            var smallMessageImage = document.createElement('img');
            smallMessageImage.className = 'small-message-image';
            smallMessageImage.src = iconUnraveled;

            var smallMessageTitle = document.createElement('p');
            smallMessageTitle.innerText = message.messageTheme;
            smallMessageTitle.className = 'compact-message-theme size-24';

            var smallMessageSenders = document.createElement('p');
            smallMessageSenders.innerText = message.messageDate + ', от: ' +
                message.sender.fio.split(' ')[0] + ' ' +
                message.sender.fio.split(' ')[1].charAt(0) + '. ' +
                message.sender.fio.split(' ')[2].charAt(0) + '.';
            smallMessageSenders.className = 'compact-message-sender size-20';

            smallMessageDiv.appendChild(smallMessageImage);
            smallMessageDiv.appendChild(smallMessageTitle);
            smallMessageDiv.appendChild(smallMessageSenders);
            document.getElementById('messages-received-div').appendChild(smallMessageDiv);

            var expandedMessageDiv = document.createElement('div');
            expandedMessageDiv.className = 'message-expanded-div dark';
            expandedMessageDiv.id = 'expanded-received-' + i;

            var expandedTheme = document.createElement('textarea');
            expandedTheme.className = 'size-32 dark expanded-message-theme';
            expandedTheme.disabled = true;
            expandedTheme.value = message.messageTheme;

            var expandedSender = document.createElement('textarea');
            expandedSender.className = 'size-24 dark expanded-message-sender';
            expandedSender.disabled = true;
            expandedSender.value = 'От: ' +
                message.sender.fio.split(' ')[0] + ' ' +
                message.sender.fio.split(' ')[1].charAt(0) + '. ' +
                message.sender.fio.split(' ')[2].charAt(0) + '., ' +
                message.sender.email + ', ' +
                message.messageDate;

            var expandedReceivers = document.createElement('textarea');
            expandedReceivers.className = 'size-24 dark expanded-message-receivers';
            expandedReceivers.disabled = true;

            var receiverString = 'Кому: ';
            var receiver;
            for (var k = 0; k < message.receivers.length - 1; k++) {
                receiver = message.receivers[k];
                receiverString = receiverString + receiver.fio.split(' ')[0] + ' ' + receiver.fio.split(' ')[1].charAt(0) + '. ' + receiver.fio.split(' ')[2].charAt(0) + '., ' + receiver.email + '; ';
            }
            receiver = message.receivers[message.receivers.length - 1];
            receiverString = receiverString + receiver.fio.split(' ')[0] + ' ' + receiver.fio.split(' ')[1].charAt(0) + '. ' + receiver.fio.split(' ')[2].charAt(0) + '., ' + receiver.email;
            expandedReceivers.value = receiverString;

            var expandedMessage = document.createElement('textarea');
            expandedMessage.className = 'size-24 dark expanded-message-message';
            expandedMessage.disabled = true;
            expandedMessage.value = message.messageText;

            var respondImage = document.createElement('img');
            respondImage.className = 'expanded-message-image';
            respondImage.src = iconMessage;

            var respondButton = document.createElement('button');
            respondButton.type = 'button';
            respondButton.innerText = 'Ответить на сообщение';
            respondButton.className = 'respond-button dark-background expanded-message-button size-24 light';

            var deleteImage = document.createElement('img');
            deleteImage.className = 'expanded-message-image';
            deleteImage.src = iconDelete;

            var deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.innerText = 'Удалить сообщение';
            deleteButton.className = 'delete-button dark-background expanded-message-button size-24 light';
            deleteButton.style.marginLeft = '235px';

            expandedMessageDiv.appendChild(expandedTheme);
            expandedMessageDiv.appendChild(expandedSender);
            expandedMessageDiv.appendChild(expandedReceivers);
            expandedMessageDiv.appendChild(expandedMessage);
            respondButton.insertBefore(respondImage, respondButton.firstChild)
            expandedMessageDiv.appendChild(respondButton);
            deleteButton.insertBefore(deleteImage, deleteButton.firstChild);
            expandedMessageDiv.appendChild(deleteButton);

            document.getElementById('messages-message-div').appendChild(expandedMessageDiv);
        }
    }

    function showSentMessages(messageArray) {
        for (var i = messageArray.length - 1; i >= 0; i--) {
            var message = messageArray[i];
            //console.log(message);

            var smallMessageDiv = document.createElement('div');
            smallMessageDiv.className = 'message-compact-div dark-background light';
            smallMessageDiv.id = 'compact-sent-' + i;

            var smallMessageImage = document.createElement('img');
            smallMessageImage.className = 'small-message-image';
            smallMessageImage.src = iconUnraveled;

            var smallMessageTitle = document.createElement('p');
            smallMessageTitle.innerText = message.messageTheme;
            smallMessageTitle.className = 'compact-message-theme size-24';

            var smallMessageSenders = document.createElement('p');
            smallMessageSenders.className = 'compact-message-sender size-20';

            var receiverString = 'кому: ';
            var expandedReceiverString = 'Кому: ';
            var receiver;
            for (var j = 0; j < message.receivers.length - 1; j++) {
                receiver = message.receivers[j];
                receiverString = receiverString + receiver.fio.split(' ')[0] + ' ' + receiver.fio.split(' ')[1].charAt(0) + '. ' + receiver.fio.split(' ')[2].charAt(0) + '., ';
                expandedReceiverString = expandedReceiverString + receiver.fio.split(' ')[0] + ' ' + receiver.fio.split(' ')[1].charAt(0) + '. ' + receiver.fio.split(' ')[2].charAt(0) + '., ' + receiver.email + '; ';
            }
            receiver = message.receivers[message.receivers.length - 1];
            receiverString = receiverString + receiver.fio.split(' ')[0] + ' ' + receiver.fio.split(' ')[1].charAt(0) + '. ' + receiver.fio.split(' ')[2].charAt(0) + '.';
            expandedReceiverString = expandedReceiverString + receiver.fio.split(' ')[0] + ' ' + receiver.fio.split(' ')[1].charAt(0) + '. ' + receiver.fio.split(' ')[2].charAt(0) + '., ' + receiver.email;

            smallMessageSenders.innerText = message.messageDate + ', ' + receiverString;

            smallMessageDiv.appendChild(smallMessageImage);
            smallMessageDiv.appendChild(smallMessageTitle);
            smallMessageDiv.appendChild(smallMessageSenders);
            document.getElementById('messages-sent-div').appendChild(smallMessageDiv);

            var expandedMessageDiv = document.createElement('div');
            expandedMessageDiv.className = 'message-expanded-div dark';
            expandedMessageDiv.id = 'expanded-sent-' + i;

            var expandedTheme = document.createElement('textarea');
            expandedTheme.className = 'size-32 dark expanded-message-theme';
            expandedTheme.disabled = true;
            expandedTheme.value = message.messageTheme;

            var expandedSender = document.createElement('textarea');
            expandedSender.className = 'size-24 dark expanded-message-sender';
            expandedSender.disabled = true;
            expandedSender.value = 'От: ' +
                message.sender.fio.split(' ')[0] + ' ' +
                message.sender.fio.split(' ')[1].charAt(0) + '. ' +
                message.sender.fio.split(' ')[2].charAt(0) + '., ' +
                message.sender.email + ', ' +
                message.messageDate;

            var expandedReceivers = document.createElement('textarea');
            expandedReceivers.className = 'size-24 dark expanded-message-receivers';
            expandedReceivers.disabled = true;

            expandedReceivers.value = expandedReceiverString;

            var expandedMessage = document.createElement('textarea');
            expandedMessage.className = 'size-24 dark expanded-message-message';
            expandedMessage.disabled = true;
            expandedMessage.value = message.messageText;

            var respondImage = document.createElement('img');
            respondImage.className = 'expanded-message-image';
            respondImage.src = iconMessage;

            var respondButton = document.createElement('button');
            respondButton.type = 'button';
            respondButton.innerText = 'Ответить на сообщение';
            respondButton.className = 'respond-button size-24 light dark-background expanded-message-button';

            var deleteImage = document.createElement('img');
            deleteImage.className = 'expanded-message-image';
            deleteImage.src = iconDelete;

            var deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.innerText = 'Удалить сообщение';
            deleteButton.className = 'delete-button size-24 light dark-background expanded-message-button';
            deleteButton.style.marginLeft = '235px';

            expandedMessageDiv.appendChild(expandedTheme);
            expandedMessageDiv.appendChild(expandedSender);
            expandedMessageDiv.appendChild(expandedReceivers);
            expandedMessageDiv.appendChild(expandedMessage);
            respondButton.insertBefore(respondImage, respondButton.firstChild)
            expandedMessageDiv.appendChild(respondButton);
            deleteButton.insertBefore(deleteImage, deleteButton.firstChild);
            expandedMessageDiv.appendChild(deleteButton);

            document.getElementById('messages-message-div').appendChild(expandedMessageDiv);
        }
    }

    function searchMessages() {
        var input = $('#messageSearch')[0].value.toUpperCase();

        var messages = $('.message-expanded-div');
        for (var i = 0; i < messages.length; i++) {
            //console.log(messages[i].id);

            var messageTheme = messages[i].querySelector('.expanded-message-theme').value.toUpperCase();
            var messageSender = messages[i].querySelector('.expanded-message-sender').value.toUpperCase().substring(4);
            var messageReceivers = messages[i].querySelector('.expanded-message-receivers').value.toUpperCase().substring(6);

            if (messageTheme.indexOf(input) > -1 || messageSender.indexOf(input) > -1 || messageReceivers.indexOf(input) > -1) {
                //console.log(messageTheme);
                //console.log(messageSender);
                //console.log(messageReceivers);

                if (messages[i].id.split('-')[1] === 'sent') {
                    $('#compact-sent-' + messages[i].id.split('-')[2]).removeClass('message-search-filter');
                }
                else {
                    $('#compact-received-' + messages[i].id.split('-')[2]).removeClass('message-search-filter');
                }
            }
            else {
                if (messages[i].id.split('-')[1] === 'sent') {
                    $('#compact-sent-' + messages[i].id.split('-')[2]).addClass('message-search-filter');
                }
                else {
                    $('#compact-received-' + messages[i].id.split('-')[2]).addClass('message-search-filter');
                }
            }
        }

        /*
        var files = $('.sca-scu-version-div');
        for (var i = 0; i < files.length; i++) {
            var fileText = files[i].querySelector('.sca-scu-version-titles-div').textContent.toUpperCase();
            //console.log(fileText);
            if (fileText.indexOf(input) > -1) {
                files[i].classList.remove('student-file-search-hidden');
            }
            else {
                files[i].classList.add('student-file-search-hidden');
            }
        }
        */
    }

    function checkValidity() {
        if (newMessageReceiversId.length > 0 && $('#new-message-theme').val() !== '' && $('#new-message-text').val() !== '') {
            document.getElementById('send-new-message-button').disabled = false;
        }
        else {
            document.getElementById('send-new-message-button').disabled = true;
        }
    }

    $(function () {

        $('#received-button').off().on('click', function () {
            $('.messages-sent-div').toggle();
            $('.messages-received-div').toggle();
            document.getElementById('received-button').disabled = true;
            document.getElementById('sent-button').disabled = false;
        });

        $('#sent-button').off().on('click', function () {
            $('.messages-sent-div').toggle();
            $('.messages-received-div').toggle();
            document.getElementById('sent-button').disabled = true;
            document.getElementById('received-button').disabled = false;
        });

        $('.message-compact-div').off().on('click', function () {
            $('.message-compact-div-selected').each(function () {
                $(this).removeClass('message-compact-div-selected');
            });
            $(this).addClass('message-compact-div-selected');

            $('.message-expanded-selected').each(function () {
                $(this).toggle();
                $(this).removeClass('message-expanded-selected');
            });

            $('#expanded-' + $(this).attr('id').split('-')[1] + '-' + $(this).attr('id').split('-')[2]).addClass('message-expanded-selected');
            $('#expanded-' + $(this).attr('id').split('-')[1] + '-' + $(this).attr('id').split('-')[2]).toggle();

            if ($(this).hasClass('compact-received-unread')) {

                var arrayId = $(this).attr('id').split('-')[2];
                var message = receivedMessages[arrayId];
                var receiverId;
                for (var j = 0; j < message.receivers.length; j++) {
                    if (message.receivers[j].email === authTokens.email) {
                        receiverId = message.receivers[j].receiverId;
                    }
                }

                axios({
                    url: apiURL + '/messages/read/',
                    method: 'POST',
                    params: {
                        'messageID': message.messageId,
                        'receiverID': receiverId,
                    },
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    //console.log(response.data);
                    $(this).removeClass('compact-received-unread');
                }).catch(result => {
                    console.log(result.data);
                });
            }
        });

        $('.delete-button').off().on('click', function () {
            //console.log( $(this).parent().attr('id') );
            $(this).attr('disabled', true);
            var messageType = $(this).parent().attr('id').split('-')[1];
            var arrayId = $(this).parent().attr('id').split('-')[2];
            var message;
            if (messageType === 'received') {
                message = receivedMessages[arrayId];
            }
            else {
                message = sentMessages[arrayId];
            }
            axios({
                url: apiURL + '/messages/delete/',
                method: 'DELETE',
                params: {
                    'messageID': message.messageId,
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response.data);
                $(this).parent().addClass('message-deleted');
                $('#compact-' + messageType + '-' + arrayId).addClass('message-deleted');
            }).catch(result => {
                console.log(result.data);
                $(this).attr('disabled', false);
            });
        });

        $('#contacts-search').off().on('click', function () {
            axios({
                url: apiURL + '/messages/find/receivers/',
                method: 'GET',
                params: {
                    'inputString': $('#contacts-input').val().trim(),
                },
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                for (var i = 0; i < response.data.length; i++) {
                    var contact = document.createElement('p');
                    contact.className = 'contact-search-item';
                    contact.id = 'contact-search-' + response.data[i].receiverId;
                    contact.innerText = response.data[i].fio + ', ' + response.data[i].email;
                    document.getElementById('contact-search-content').appendChild(contact);
                }
            }).catch(result => {
                console.log(result);
            });

        });

        $('#recommended-contacts').off().on('click', function () {
            $('#recommended-contact-content').toggle();
        });

        $('body').off().on('click', function (e) {
            $('.contact-search-item').each(function () {
                if ($(this).is(e.target)) {
                    //console.log($(this).attr('id').split('-')[2]);

                    if (!newMessageReceiversId.includes($(this).attr('id').split('-')[2])) {
                        var compactReceiverDiv = document.createElement('div');
                        compactReceiverDiv.className = 'new-message-compact-receiver-div size-24 dark';

                        var compactReceiverText = document.createElement('span');
                        compactReceiverText.innerText = $(this).text();

                        var compactCloseButton = document.createElement('button');
                        compactCloseButton.type = 'button';
                        compactCloseButton.className = 'new-message-compact-receiver-button';
                        compactCloseButton.innerText = 'X';
                        compactCloseButton.id = 'close-button-' + $(this).attr('id').split('-')[2];

                        compactReceiverDiv.appendChild(compactReceiverText);
                        compactReceiverDiv.appendChild(compactCloseButton);
                        document.getElementById('new-receivers-div').appendChild(compactReceiverDiv);

                        newMessageReceiversId.push($(this).attr('id').split('-')[2]);
                        checkValidity();
                    }
                }
                $(this).remove();
            });

            $('.recommended-contact-item').each(function () {
                if ($(this).is(e.target)) {
                    //console.log($(this).attr('id').split('-')[2]);

                    if (!newMessageReceiversId.includes($(this).attr('id').split('-')[2])) {
                        var compactReceiverDiv = document.createElement('div');
                        compactReceiverDiv.className = 'new-message-compact-receiver-div size-24 dark';

                        var compactReceiverText = document.createElement('span');
                        compactReceiverText.innerText = $(this).text();

                        var compactCloseButton = document.createElement('button');
                        compactCloseButton.type = 'button';
                        compactCloseButton.className = 'new-message-compact-receiver-button';
                        compactCloseButton.innerText = 'X';
                        compactCloseButton.id = 'close-button-' + $(this).attr('id').split('-')[2];

                        compactReceiverDiv.appendChild(compactReceiverText);
                        compactReceiverDiv.appendChild(compactCloseButton);
                        document.getElementById('new-receivers-div').appendChild(compactReceiverDiv);

                        newMessageReceiversId.push($(this).attr('id').split('-')[2]);
                        checkValidity();
                    }
                }
            });

            if ($('#recommended-contact-content').is(':visible') && e.target.id !== 'recommended-contacts') {
                $('#recommended-contact-content').toggle();
            }

            $('.new-message-compact-receiver-button').each(function () {
                if ($(this).is(e.target)) {
                    //console.log($(this).parent());
                    var receiverId = $(this).attr('id').split('-')[2];
                    newMessageReceiversId.splice(newMessageReceiversId.indexOf(receiverId), 1);
                    //console.log(newMessageReceiversId);
                    $(this).parent().remove();
                    checkValidity();
                }
            });

        });

        $('#send-new-message-button').off().on('click', function () {
            $(this).attr('disabled', 'true');
            var receiversString = '';
            for (var i = 0; i < newMessageReceiversId.length - 1; i++) {
                receiversString += newMessageReceiversId[i] + ',';
            }
            receiversString += newMessageReceiversId[newMessageReceiversId.length - 1];

            var formData = new FormData();
            formData.append('messageTheme', $('#new-message-theme').val());
            formData.append('messageText', $('#new-message-text').val());
            formData.append('receivers', receiversString);

            axios({
                url: apiURL + '/messages/send',
                method: 'POST',
                data: formData,
                headers: {
                    'Authorization': 'Bearer ' + authTokens.accessToken
                },
            }).then((response) => {
                //console.log(response);
                window.location.reload();
            }).catch(result => {
                console.log(result.data);
            });
            $(this).attr('disabled', 'false');
        });

        $('.respond-button').off().on('click', function () {
            window.responding = true;
            setShowCreate(true);
        });

    });

    return (
        <div className='messages-big-div'>

            <div className='messages-switch-div light-background'>
                <button type='button' id='received-button' className='light size-23 dark-background messages-button' disabled style={{ width: '162px', position: 'relative', top: '-18px' }}>
                    <Image src={iconReceived} thumbnail className='message-icon-small dark-background' />
                    Получено
                </button>
                <button type='button' id='sent-button' className='light size-23 dark-background messages-button' style={{ width: '187px', position: 'relative', top: '-18px' }}>
                    <Image src={iconSent} thumbnail className='message-icon-small dark-background' />
                    Отправлено
                </button>
                <button type='button' className='light size-23 dark-background messages-button' style={{ width: '230px', marginLeft: '5px' }} onClick={() => { setShowCreate(true); }}>
                    <Image src={iconMessage} thumbnail className='message-icon-small dark-background' style={{ position: 'relative', top: '-18px' }} />
                    <p style={{ display: 'inline-block' }}>Написать новое<br />сообщение</p>
                </button>
            </div>

            <div className='messages-search-div light-background'>
                <input id='messageSearch' type='text' className='messages-search dark size-32' placeholder='Поиск по сообщениям' />
                <button onClick={() => { searchMessages(); }} className='messages-search-button dark-background light size-32'>
                    <Image src={iconLookingGlass} thumbnail className='icon-smaller dark-background' />
                    Поиск
                </button>
            </div>

            <div>
                <div id='messages-sent-div' className='messages-sent-div light-background'>

                </div>

                <div id='messages-received-div' className='messages-received-div light-background'>

                </div>
            </div>

            <div id='messages-message-div' className='messages-message-div light-background dark'>

            </div>

            <Modal centered show={showCreate} onEnter={(e) => {
                newMessageReceiversId = [];
                if (window.responding) {
                    //console.log( $('.message-expanded-selected .expanded-message-theme').val());
                    document.getElementById('new-message-theme').value = 'Re: ' + $('.message-expanded-selected .expanded-message-theme').val();
                    //console.log( $('.message-expanded-selected .expanded-message-sender').val().split(',')[1].trim() );
                    var senderEmail = $('.message-expanded-selected .expanded-message-sender').val().split(',')[1].trim();

                    axios({
                        url: apiURL + '/messages/find/receivers/',
                        method: 'GET',
                        params: {
                            'inputString': senderEmail,
                        },
                        headers: {
                            'Authorization': 'Bearer ' + authTokens.accessToken
                        },
                    }).then((response) => {
                        //console.log(response);
                        var sender = response.data[0];
                        //console.log(sender);

                        var compactReceiverDiv = document.createElement('div');
                        compactReceiverDiv.className = 'new-message-compact-receiver-div size-24 dark';

                        var compactReceiverText = document.createElement('span');
                        compactReceiverText.innerText = sender.fio + ', ' + sender.email;

                        var compactCloseButton = document.createElement('button');
                        compactCloseButton.type = 'button';
                        compactCloseButton.className = 'new-message-compact-receiver-button';
                        compactCloseButton.innerText = 'X';
                        compactCloseButton.id = 'close-button-' + sender.receiverId;

                        compactReceiverDiv.appendChild(compactReceiverText);
                        compactReceiverDiv.appendChild(compactCloseButton);
                        document.getElementById('new-receivers-div').appendChild(compactReceiverDiv);

                        newMessageReceiversId.push(sender.receiverId.toString());
                        checkValidity();

                    }).catch(result => {
                        console.log(result);
                    });

                }
                window.responding = false;

                axios({
                    url: apiURL + '/messages/find/receivers/associated',
                    method: 'GET',
                    params: {
                        'inputString': senderEmail,
                    },
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.accessToken
                    },
                }).then((response) => {
                    //console.log(response);
                    for (var i = 0; i < response.data.length; i++) {
                        var contact = document.createElement('p');
                        contact.className = 'recommended-contact-item';
                        contact.id = 'recommended-contact-' + response.data[i].receiverId;
                        contact.innerText = response.data[i].fio + ', ' + response.data[i].email;
                        document.getElementById('recommended-contact-content').appendChild(contact);
                    }
                }).catch(result => {
                    console.log(result);
                }).then(() => {
                    axios({
                        url: apiURL + '/messages/find/recent/contacts/',
                        method: 'GET',
                        params: {
                            'limit': 5,
                        },
                        headers: {
                            'Authorization': 'Bearer ' + authTokens.accessToken
                        },
                    }).then((response) => {
                        console.log(response.data);

                        if (response.data.length > 0) {
                            var contactMessage = document.createElement('p');
                            contactMessage.innerText = 'Недавние контакты:';
                            document.getElementById('recommended-contact-content').appendChild(contactMessage);

                            for (var i = 0; i < response.data.length; i++) {
                                var contact = document.createElement('p');
                                contact.className = 'recommended-contact-item';
                                contact.id = 'recommended-contact-' + response.data[i].receiverId;
                                contact.innerText = response.data[i].fio + ', ' + response.data[i].email;
                                document.getElementById('recommended-contact-content').appendChild(contact);
                            }
                        }

                    }).catch(result => {
                        console.log(result);
                    });
                });


                document.getElementById('recommended-contacts').disabled = false;

            }} onHide={(e) => { setShowCreate(false); }} className='dark'>
                <Modal.Header className='light-background messages-modal-header' closeButton>
                    <Modal.Title className='size-30'>
                        <p style={{ height: '50px', marginBottom: '0px', marginLeft: '580px' }}>Новое сообщение</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='light-background messages-modal-body'>
                    <div className='messages-search-div light-background' style={{ marginLeft: '0px', width: '1370px' }}>
                        <div className='contact-search-dropdown-div'>
                            <input id='contacts-input' type='text' className='messages-search dark size-32' placeholder='Поиск по контактам' style={{ marginLeft: '0px', width: '745px' }} />
                            <div id='contact-search-content' className='contact-search-dropdown-content size-24 dark'>

                            </div>
                        </div>

                        <button id='contacts-search' className='messages-search-button dark-background light size-32' style={{ marginLeft: '750px' }}>
                            <Image src={iconLookingGlass} thumbnail className='icon-smaller dark-background' />
                            Поиск
                        </button>
                        <div className='contact-search-dropdown-div'>
                            <button id='recommended-contacts' disabled className='messages-contacts-button dark-background light size-32' style={{ position: 'relative', top: '-43px' }}>
                                <Image src={iconStudents} thumbnail className='icon-smaller dark-background' />
                                Рекомендуемые контакты
                            </button>
                            <div id='recommended-contact-content' className='recommended-contact-dropdown-content size-24 dark'>

                            </div>
                        </div>
                    </div>
                    <div id='new-receivers-div' className='new-message-receivers-div'>
                        <p className='new-message-receivers-text size-24 dark'>Кому:</p>

                    </div>
                    <div>
                        <textarea id='new-message-theme' className='expanded-message-theme dark size-24' style={{ width: '1370px' }} placeholder='Тема сообщения' onChange={() => { checkValidity(); }}>

                        </textarea>
                        <textarea id='new-message-text' className='expanded-message-message dark size-24' style={{ width: '1370px' }} placeholder='Текст сообщения' onChange={() => { checkValidity(); }}>

                        </textarea>
                        <button disabled id='send-new-message-button' type='button' className='size-32 light dark-background expanded-message-button' style={{ marginLeft: '572px', paddingLeft: '10px', paddingRight: '10px' }}>
                            <Image src={iconMessage} thumbnail className='message-icon-small dark-background' style={{ position: 'relative', width: '70px', height: '70px' }} />
                            <p style={{ display: 'inline-block' }}>Отправить</p>
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}