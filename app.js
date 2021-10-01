
const mapcontainer = document.querySelector('.map');
const form = document.querySelector('form');
const ip_address = document.querySelector('.ip');
const user_location = document.querySelector('.location');
const user_timezone = document.querySelector('.timezone');
const isp_location = document.querySelector('.isp');
let status = document.querySelector('.status');
let h4 = document.querySelectorAll('.display-details div h4')
import apiKey from './keys.js';
let direct_ip;
let map;

document.addEventListener('DOMContentLoaded',async ()=>{
	const IPIFY_API = await fetch('https://api.ipify.org?format=json')
	const IPIFY_RES = await IPIFY_API.json()
	 direct_ip = IPIFY_RES.ip
	callApi(IPIFY_RES.ip)
})

async function callApi(ip){
	const request = await fetch(`https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${direct_ip}`)
	const response = await request.json()
	loadMap(response)
	updateLayers(response)
}

function updateLayers(response) {

	const{ ip, isp, location: {country, region, city, timezone},} = response

	ip_address.innerText = ip
	user_location.innerText = `${country}, ${region}, ${city}`
	user_timezone.innerText = `UTC${timezone}`
	isp_location.innerText = isp
	status.innerText = 'FOUND'
	status.style.animation = 'none'
	h4.forEach(el=> {el.style.animation = 'none'})
}

const icon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [38, 45],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

function loadMap(res){
	const {lat,lng} = res.location
	 map = L.map(mapcontainer).setView([lat, lng], 13);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	L.marker([lat, lng], {icon}).addTo(map)
}

form.addEventListener('submit', searchIp);

async function searchIp(e){
	e.preventDefault()
	document.querySelector('.status').innerText = 'SEARCHING FOR IP'
	ip_address.innerText = '...'
	user_location.innerText = '...'
	user_timezone.innerText = '...'
	isp_location.innerText = '...'
	let searched_ip_value = document.querySelector('#ip-address').value
	if(!searched_ip_value == null || !searched_ip_value == '' || !searched_ip_value == undefined || !searched_ip_value.length < 8){
		map.remove()
		callApi(searched_ip_value)
	} else {
		map.remove()
		callApi(direct_ip)
	}
}



