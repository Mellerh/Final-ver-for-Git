// импортируем функцию валиадции
import {ipCheck} from "./helpers/validate-ip.js"

// импортируем функцию отрисовки карты
import {drawMap} from "./helpers/map-leaflet.js"

// импортируем функцию, которая отодвигает маркер на карте на небольших устройствах
import {addoffset} from "./helpers/add-offset.js"



// GLOBALS
// получаем input и btn для получения значения ip
const input = document.querySelector('.search-bar__input');
const btn = document.querySelector('.search-bar__btn');


// получаем элементы DOM, для динамической отрисовки значений, получаемых от сервера (ip-address/location...)
const ipAddress = document.getElementById('ip');
const locationIp = document.getElementById('location');
const timeZoneIp = document.getElementById('timezone');
const ispIp = document.getElementById('isp');


// получаем элемент div, где будем рисовать карту
const mapArea = document.querySelector('.map')


// создаём перемееную map, которая будет валидна для библиотеки leaflet и задаём ей дефолтные координаты. 
const map = L.map(mapArea, {
    // в сenter мы задаём координаты
    center: [51.505, -0.09],
    zoom: 13 
})


// если нам нужно изменить координаты
// map.setView([51.505, -0.09], 13)
// добавляем маркер, указывающий на точку на карте
// L.marker([51.5, -0.09]).addTo(map);




// ATTACH EVENTS

input.addEventListener('keypress', handleInput);
btn.addEventListener('click', handleBtnClick);




// BASIC LOGIC

// обрабатываем инпут
function handleInput(event) {

    // получаем значение input
    let inputValue = this.value.trim();
    // let inputValue = "51.15.104.232";
    // если нажат enter
    if (event.key === "Enter") {

        //проверяем на валидность введённый ip. если true...
        if (ipCheck(inputValue)) {
            // отправляем в асинк функцию для получение данных по ip
            getIp(inputValue);     
            this.value = ''
        }
    }
    

}

// обрабатываем нажатие на button
function handleBtnClick() {
    let inputValue = input.value.trim();

    //проверяем на валидность введённый ip в input
    if (ipCheck(inputValue)) {
        // вызываем асинхрон функцию и передаём туда ip
        getIp(inputValue);
        input.value = ''
    }

}

// отрисовываем MAP карту
drawMap(map)



// отрисовываем таблицу исходя из полученных данных из функции getIp
function tableChange(ipData) {
    // используем ключи объекта ipData для доступа к данным

    // ipadredd
    ipAddress.innerText = ipData.ip;
    // iplocation.используем шаблонные строки для организации значений в соотвествии с дизайном
    locationIp.innerText = `${ipData.location.region}, ${ipData.location.country}`;
    // timezone
    timeZoneIp.innerText = ipData.location.timezone;
    // isp
    ispIp.innerText = ipData.isp;



    // изменяем координаты дефотлной широты/долготы у map. данные получили с сервера
    map.setView([ipData.location.lat, ipData.location.lng]);
    // изменяем координаты дефотлной широты/долготы у map-маркера. данные получили с сервера
    L.marker([ipData.location.lat, ipData.location.lng]).addTo(map);


    // если размер экрана меньше 1023px, то вызываем addoffset и двигаем карту
    if (matchMedia("(max-width: 1023px)")) {
        addoffset(map);
    }
}





// ASYNC LOGIC

// получаем ip и отправляем его на сервер
async function getIp(ipAddress) {
    
    try {
        // посылам get-запрос на сервер с ip, который ввёл пользователь
        const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_7s7qzYROEIGvrHway7hah9HfyYX3I&ipAddress=${ipAddress}`);
        
        
        // получаем данные с сервера для их отрисовки в dom-разметке
        const cleanData = await response.json();
    
        // передаём данные для отрисовки в tableChange
        tableChange(cleanData);
        
    } catch (error) {
        console.log(error);
    }
}


