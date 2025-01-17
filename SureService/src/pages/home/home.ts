import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ContactProvider } from './../../providers/contact/contact';
import { ContactEditPage } from '../contact-edit/contact-edit';
//import { Geolocation } from '@ionic-native/geolocation';
import * as firebase from 'Firebase';
//import { AnunciantePage } from '../anunciante/anunciante';

declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public PATH = 'anuncios/';
  public data = null;
  public anuncios = [];
  public latitude = -23.162035;
  public longitude = -45.795401;

  @ViewChild('map') mapElement: ElementRef;

  map: any;
  markers: any;

  ref = firebase.database().ref('chatrooms/');

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public provider: ContactProvider,
    //private geolocation: Geolocation,
    public menuCtrl: MenuController) {
      this.menuCtrl.enable(true, 'MyMenu');
      this.data = this.provider.getAllKey();
      console.log(this.data);
      //this.mylocation();
    }

  ionViewDidEnter() {
    this.initMap();
  }

  /*mylocation(){
    this.geolocation.getCurrentPosition().then((position) => {
      
      console.log("Latitude: " + position.coords.latitude);
      console.log("Longitude: " + position.coords.longitude);
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      
      this.options = {
        center: { lat: "-23.175448", lng: "-45.843689" },
        zoom: 15,
        streetViewControl: false,
        disableDefaultUI: true,
        animation: google.maps.Animation.DROP,
        styles:[
          {
              "featureType": "all",
              "stylers": [{"saturation": 0},{"hue": "#e7ecf0"}]
          },
          {
              "featureType": "road",
              "stylers": [{"saturation": -70 }]
          },
          {
              "featureType": "transit",
              "stylers": [{"visibility": "off"}]
          },
          {
              "featureType": "poi",
              "stylers": [{"visibility": "off"}]
          },
          {
              "featureType": "water",
              "stylers": [{"visibility": "simplified"},{"saturation": -60}]
          }
        ]
      }
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }*/

  initMap() {
    
    var options = {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 16,
      streetViewControl: false,
      disableDefaultUI: true,
      animation: google.maps.Animation.DROP,
      styles:[
        {
            "featureType": "all",
            "stylers": [{"saturation": 0},{"hue": "#e7ecf0"}]
        },
        {
            "featureType": "road",
            "stylers": [{"saturation": -70 }]
        },
        {
            "featureType": "transit",
            "stylers": [{"visibility": "off"}]
        },
        {
            "featureType": "poi",
            "stylers": [{"visibility": "off"}]
        },
        {
            "featureType": "water",
            "stylers": [{"visibility": "simplified"},{"saturation": -60}]
        }
      ]
    }
      console.log("Criando mapa...");
      this.map = new google.maps.Map(this.mapElement.nativeElement, options);
      this.MyMarker(this.map, this.latitude, this.longitude); 
      
      console.log("Carregando anuncios...");
      this.data.subscribe(anuncios => {
        for (let anuncio of anuncios) {
          this.anuncios.push({
            key: anuncio.key,
            name: anuncio.name,
            tel: anuncio.tel,
            latitude: anuncio.latitude,
            longitude: anuncio.longitude,
            categoria: anuncio.categoria,
            descricao: anuncio.descricao,
          });
          this.addMarker(this.map, anuncio.latitude, anuncio.longitude, anuncio.name, anuncio.categoria + '.png', anuncio.categoria, anuncio);
        }
        console.log("Anuncios inseridos: " + this.anuncios.length);
        console.log(this.anuncios);
      });
  }

  addMarker(map, latitude, longitude, titulo, marcador, categoria, anuncio) {
    var position = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({position,title: titulo,map,icon: 'assets/imgs/' + marcador})
    this.addInfoWindowToMarker(marker, categoria, anuncio);
    return marker;
  }

  MyMarker(map, latitude, longitude) {
    var position = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({position,animation: google.maps.Animation.DROP,map,})
    return marker;
  }

  addInfoWindowToMarker(marker, categoria, anuncio) {
    /*var infoWindowContent =
      '<div id="content"' +
      '<ion-item>' +
      '<ion-row>' +
      '<h6>' + marker.title + '</h6>' +
      categoria + '<br><br>' +
      '<a>Verificar anuncio</a>' +
      '</ion-row>' +
      '</ion-item>'
      ;
    var infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });*/
    marker.addListener('click', () => {
      //infoWindow.open(this.map, marker);
      //this.navCtrl.push(AnuncioPage, { contact: anuncio });
      this.presentAlert(anuncio);
    });
  }

  newContact() {
    this.navCtrl.push(ContactEditPage);
  }

  /*getAnuncio(){
    this.navCtrl.push(AnuncioPage);
  }*/

  presentAlert(anuncio) {
    let alert = this.alertCtrl.create({
      title: anuncio.name,
      subTitle: anuncio.categoria,
      message: anuncio.descricao+
        '<br><br>Telefone: '+anuncio.tel,
      buttons: [
        {
          text: 'Enviar mensagem',
          handler: () => {
              let newData = this.ref.push();
              newData.set({
                roomname: anuncio.name
              });
          }
        },
       /* {
          text: 'Perfil do Anunciante',
          handler: () => {
            this.navCtrl.push(AnunciantePage);
          }
        },*/
        {
          text: 'VOLTAR',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
      ]
    });
    alert.present();
  }
  
}
