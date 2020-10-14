import React from 'react';


export default class InfoTextBlock4 extends React.Component {
    render() {
        return(
        <div className='dark info-text-block'>
            <p className='size-24 info-text-block-title'>ПОДГОТОВКА И ЗАЩИТА ВКР</p>
            <div>
                <p id='NIRStart' className='size-20 info-text-block-start-date'><b>Начало: 25.05.2021</b></p>
                <p id='NIREnd' className='size-20 info-text-block-end-date'><b>Конец: 05.07.2021</b></p>
            </div>
            <div style={{clear: 'both'}}></div>
            <div className='size-20 info-text-block-content'>
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
    );
    }
    
}