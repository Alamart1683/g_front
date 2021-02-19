import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../auth/AuthContext';
import { apiURL } from '../../Config';
import $ from 'jquery';
import { Image } from 'react-bootstrap';

import iconLookingGlass from '../../images/icons/lookingglass.png';

export default function MessagesPage() {
    const { authTokens } = useAuthContext();
    const [fetchedData, setFetchedData] = useState(false);
    
    const [sentMessages, setSentMessages] = useState([]);
    const [receivedMessages, setReceivedMessages] = useState([]);

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
        for (var i = 0; i< messageArray.length; i++) {
            var message = messageArray[i];
            //console.log(message);
            
            var smallMessageDiv = document.createElement('div');
            smallMessageDiv.className = 'message-compact-div dark-background light';
            smallMessageDiv.id = 'compact-received-'+i;
            
            var smallMessageTitle = document.createElement('p');
            smallMessageTitle.innerText = message.messageTheme;
            smallMessageTitle.className = 'compact-message-theme size-24';

            var smallMessageSenders = document.createElement('p');
            smallMessageSenders.innerText = 'От: ' + 
                message.sender.fio.split(' ')[0] + ' ' + 
                message.sender.fio.split(' ')[1].charAt(0) + '. ' + 
                message.sender.fio.split(' ')[2].charAt(0) + '.';
            smallMessageSenders.className = 'compact-message-sender size-20';

            smallMessageDiv.appendChild(smallMessageTitle);
            smallMessageDiv.appendChild(smallMessageSenders);
            document.getElementById('messages-received-div').appendChild(smallMessageDiv);

            var expandedMessageDiv = document.createElement('div');
            expandedMessageDiv.className = 'message-expanded-div dark';
            expandedMessageDiv.id = 'expanded-received-'+i;

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
                message.sender.email;

            var expandedReceivers = document.createElement('textarea');
            expandedReceivers.className = 'size-24 dark expanded-message-receivers';
            expandedReceivers.disabled = true;

            var receiverString = 'Кому: ';
            var receiver;
            for (var j = 0; j < message.receivers.length - 1; j++) {
                receiver = message.receivers[j];
                receiverString = receiverString + receiver.fio.split(' ')[0] + ' ' + receiver.fio.split(' ')[1].charAt(0) + '. ' + receiver.fio.split(' ')[2].charAt(0) + '., ' + receiver.email + '; ';
            }
            receiver = message.receivers[message.receivers.length - 1];
            receiverString = receiverString + receiver.fio.split(' ')[0] + ' ' + receiver.fio.split(' ')[1].charAt(0) + '. ' + receiver.fio.split(' ')[2].charAt(0) + '., ' + receiver.email;
            expandedReceivers.value = receiverString;

            var expandedMessage = document.createElement('textarea');
            expandedMessage.className = 'size-24 dark expanded-message-message';
            expandedMessage.disabled = true;
            expandedMessage.value = message.messageText;

            var respondButton = document.createElement('button');
            respondButton.type = 'button';
            respondButton.innerText = 'Ответить на сообщение';
            respondButton.className = 'respond-button expanded-message-button size-24 light dark-background';

            var historyButton = document.createElement('button');
            historyButton.type = 'button';
            historyButton.innerText = 'Открыть историю переписок';
            historyButton.className = 'history-button expanded-message-button size-24 light dark-background';
            historyButton.style.marginLeft = '270px';

            expandedMessageDiv.appendChild(expandedTheme);
            expandedMessageDiv.appendChild(expandedSender);
            expandedMessageDiv.appendChild(expandedReceivers);
            expandedMessageDiv.appendChild(expandedMessage);
            expandedMessageDiv.appendChild(respondButton);
            expandedMessageDiv.appendChild(historyButton);

            document.getElementById('messages-message-div').appendChild(expandedMessageDiv);
        }
    }

    function showSentMessages(messageArray) {
        for (var i = 0; i< messageArray.length; i++) {
            var message = messageArray[i];
            //console.log(message);
            
            var smallMessageDiv = document.createElement('div');
            smallMessageDiv.className = 'message-compact-div dark-background light';
            smallMessageDiv.id = 'compact-sent-'+i;
            
            var smallMessageTitle = document.createElement('p');
            smallMessageTitle.innerText = message.messageTheme;
            smallMessageTitle.className = 'compact-message-theme size-24';

            var smallMessageSenders = document.createElement('p');
            smallMessageSenders.className = 'compact-message-sender size-20';

            var receiverString = 'Кому: ';
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

            smallMessageSenders.innerText = receiverString;

            smallMessageDiv.appendChild(smallMessageTitle);
            smallMessageDiv.appendChild(smallMessageSenders);
            document.getElementById('messages-sent-div').appendChild(smallMessageDiv);
            
            var expandedMessageDiv = document.createElement('div');
            expandedMessageDiv.className = 'message-expanded-div dark';
            expandedMessageDiv.id = 'expanded-sent-'+i;

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
                message.sender.email;

            var expandedReceivers = document.createElement('textarea');
            expandedReceivers.className = 'size-24 dark expanded-message-receivers';
            expandedReceivers.disabled = true;

            expandedReceivers.value = expandedReceiverString;

            var expandedMessage = document.createElement('textarea');
            expandedMessage.className = 'size-24 dark expanded-message-message';
            expandedMessage.disabled = true;
            expandedMessage.value = message.messageText;

            var respondButton = document.createElement('button');
            respondButton.type = 'button';
            respondButton.innerText = 'Ответить на сообщение';
            respondButton.className = 'respond-button expanded-message-button size-24 light dark-background';

            var historyButton = document.createElement('button');
            historyButton.type = 'button';
            historyButton.innerText = 'Открыть историю переписок';
            historyButton.className = 'history-button expanded-message-button size-24 light dark-background';
            historyButton.style.marginLeft = '270px';

            expandedMessageDiv.appendChild(expandedTheme);
            expandedMessageDiv.appendChild(expandedSender);
            expandedMessageDiv.appendChild(expandedReceivers);
            expandedMessageDiv.appendChild(expandedMessage);
            expandedMessageDiv.appendChild(respondButton);
            expandedMessageDiv.appendChild(historyButton);

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
                    $('#compact-sent-'+messages[i].id.split('-')[2]).removeClass('message-search-filter');
                }
                else {
                    $('#compact-received-'+messages[i].id.split('-')[2]).removeClass('message-search-filter');
                }
            }
            else {
                if (messages[i].id.split('-')[1] === 'sent') {
                    $('#compact-sent-'+messages[i].id.split('-')[2]).addClass('message-search-filter');
                }
                else {
                    $('#compact-received-'+messages[i].id.split('-')[2]).addClass('message-search-filter');
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

        $('.message-compact-div').off().on('click', function() {
            $( '.message-compact-div-selected' ).each(function() {
                $(this).removeClass('message-compact-div-selected');
            });
            $(this).addClass('message-compact-div-selected');

            $('.message-expanded-selected').each(function() {
                $(this).toggle();
                $(this).removeClass('message-expanded-selected');
            });

            //console.log( '.expanded-' + $(this).attr('id').split('-')[1] + '-' + $(this).attr('id').split('-')[2] );

            $('#expanded-' + $(this).attr('id').split('-')[1] + '-' + $(this).attr('id').split('-')[2]).addClass('message-expanded-selected');
            $('#expanded-' + $(this).attr('id').split('-')[1] + '-' + $(this).attr('id').split('-')[2]).toggle();
            //console.log( $(this).attr('id') );
        });

    });

    return (
        <div className='messages-big-div'>

            <div className='messages-switch-div light-background'>
                <button type='button' id='received-button' className='light size-24 dark-background messages-button' disabled style={{width:'145px'}}>Получено</button>
                <button type='button' id='sent-button' className='light size-24 dark-background messages-button' style={{width:'145px'}}>Отправлено</button>
                <button type='button' className='light size-24 dark-background messages-button' style={{width:'250px', marginLeft: '30px', position: 'relative', top: '-18px' }}>Написать новое<br />сообщение</button>
            </div>

            <div className='messages-search-div light-background'>
                <input id='messageSearch' type='text' className='messages-search dark size-32' />
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
        </div>
    );
}