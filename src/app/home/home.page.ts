import { Component } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  locationDisabledStatus: boolean;
  isLocationUnauthorized: boolean;
  message: string;
  geoLatitude: any;
  geoLongitude: any;
  geoAccuracy: any;

  constructor(
    private diagnostic: Diagnostic,
    private geolocation: Geolocation,
  ) { }

  getLocation() {

  }

  grantLocationPermission(isAllowVerification) {
    this.diagnostic.isLocationEnabled()
      .then(locationEnabled => {
        this.message = 'Location is ' + (locationEnabled ? 'enabled' : 'disabled');
        if (locationEnabled) {
          this.diagnostic.isLocationAuthorized()
            .then(authorized => {
              this.message = 'Location is ' + (authorized ? 'authorized' : 'unauthorized');
              if (!authorized) {
                // location is not authorized
                this.diagnostic.requestLocationAuthorization().then((status) => {
                  console.log('status----->>', status);
                  if (status) {
                    switch (status) {
                      case this.diagnostic.permissionStatus.NOT_REQUESTED:
                        this.message = 'Permission not requested';
                        break;
                      case this.diagnostic.permissionStatus.GRANTED:
                        this.message = 'Permission granted';
                        this.getLocationCoordinates();
                        break;
                      case this.diagnostic.permissionStatus.DENIED_ONCE:
                        this.message = 'Permission denied';
                        break;
                      case this.diagnostic.permissionStatus.DENIED_ALWAYS:
                        this.message = 'Permission permanently denied';
                        break;
                      default:
                        this.message = 'Status -->> ' + JSON.stringify(status);
                        break;
                    }
                  } else {
                    this.message = 'Status -->> ' + JSON.stringify(status);
                  }
                }).catch(error => {
                  this.message = 'Location Authorization Request Error -->> ' + JSON.stringify(error);
                });

              }
            }).catch(err => {
              this.message = 'Is Location Authorized Error -->> ' + JSON.stringify(err);
            });
        }
      }).catch(err => {
        this.message = 'Is Location Enabled Error -->> ' + JSON.stringify(err);
      });
  }

  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.geoAccuracy = resp.coords.accuracy;
    }).catch((error) => {
      alert('Error getting location' + JSON.stringify(error));
    });
  }

}
