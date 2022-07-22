let searchBtn = document.querySelector('#search-btn');
let searchBar = document.querySelector('.search-bar-container');
let formBtn = document.querySelector('#login-btn');
let loginForm = document.querySelector('.login-form-container');
let formClose = document.querySelector('#form-close');
let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');
let videoBtn = document.querySelectorAll('.vid-btn');

window.onscroll = () =>{
    searchBtn.classList.remove('fa-times');
    searchBar.classList.remove('active');
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
    loginForm.classList.remove('active');
}

menu.addEventListener('click', () =>{
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
});

searchBtn.addEventListener('click', () =>{
    searchBtn.classList.toggle('fa-times');
    searchBar.classList.toggle('active');
});

formBtn.addEventListener('click', () =>{
    loginForm.classList.add('active');
});

formClose.addEventListener('click', () =>{
    loginForm.classList.remove('active');
});

videoBtn.forEach(btn =>{
    btn.addEventListener('click', ()=>{
        document.querySelector('.controls .active').classList.remove('active');
        btn.classList.add('active');
        let src = btn.getAttribute('data-src');
        document.querySelector('#video-slider').src = src;
    });
});

var swiper = new Swiper(".review-slider", {
    spaceBetween: 20,
    loop:true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    breakpoints: {
        640: {
            slidePerView: 1,
        },
        768: {
            slidePerView: 2,
        },
        1024: {
            slidePerView: 3,
        },
    },
});

var swiper = new Swiper(".brand-slider", {
    spaceBetween: 20,
    loop:true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    breakpoints: {
        450: {
            slidesPerView: 2,
        },
        780: {
            slidesPerView: 3,
        },
        991: {
            slidesPerView: 4,
        },
        1200: {
            slidesPerView: 5,
        },
    },
});

window.onload = function () {
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        mapReady(position);
    })

    function mapReady(position) {
        var map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 15);
        var computeButton = document.getElementById('computeRoute');

        var markers = [];
        var walkIcon = createIcon('walk');
        var carIcon = createIcon('car');
        var trainIcon = createIcon('train');
        var planeIcon = createIcon('plane');

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
        }).addTo(map);

        var myLocation = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
        markers.push(myLocation);

        L.circle([position.coords.latitude, position.coords.longitude], {
            radius: position.coords.accuracy,
            color: 'blue',
            fillColor: 'blue',
            fillOpacity: '0.2'
        }).addTo(map).bindPopup("I live somewhere in this area");

        map.addEventListener('click', (e) => {
            console.log(e);
            var distance = getDistance(e.latlng, myLocation.getLatLng());
            var icon = getIconByDistance(distance);
            var marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: icon }).addTo(map)
                .bindPopup(`Distance between my position and this place: ${distance} kilometers`)
                .openPopup();
            markers.push(marker);
            drawLine([e.latlng.lat, e.latlng.lng], [position.coords.latitude, position.coords.longitude]);
        })

        function getDistance(from, to) {
            return (from.distanceTo(to)).toFixed(0) / 1000;
        }

        function drawLine(from, to) {
            L.polyline([from, to], { color: "red" }).addTo(map);
        }

        function createIcon(type) {
            return L.icon({
                iconUrl: `assets\\icons\\${type}.png`,
                iconSize: [50, 50],
                iconAnchor: [25, 25],
                popupAnchor: [0, -30]
            });
        }

        function getIconByDistance(distance) {
            if (distance < 5)
                return walkIcon;
            if (distance < 50)
                return carIcon;
            if (distance < 500)
                return trainIcon;
            return planeIcon;
        }

        computeButton.addEventListener('click', () => {
            markers.sort(compare);
            var coordinates = [];
            for (var i = 0; i<markers.length; i++)
            {
                coordinates.push(markers[i].getLatLng());
            }
            var line = L.polyline(coordinates, {color: 'green'}).addTo(map);
            map.fitBounds(line.getBounds());
        });

        function compare(p1, p2)
        {
            var a = p1.getLatLng();
            var b = p2.getLatLng();

            if (a.lng < b.lng)
                return -1;
            if (a.lng > b.lng)
                return 1;
            return 0;
        }
    }

}