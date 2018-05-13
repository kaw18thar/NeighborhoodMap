   var map;
      // Create a new blank array for all the listing markers.
      var markers = [];
      var locations = [ //21.501805, 39.257438
          {
              title: 'King AbdulAziz University',
              location: {
                  lat: 21.489565,
                  lng: 39.246226
              }
          },
          {
              title: 'Effat University',
              location: {
                  lat: 21.479613,
                  lng: 39.210809
              }
          },
          {
              title: 'Al-Balad, Jeddah',
              location: {
                  lat: 21.482095,
                  lng: 39.182610
              }
          },
          {
              title: 'King Abdullah Sport City Stadium',
              location: {
                  lat: 21.763569,
                  lng: 39.166289
              }
          },
          {
              title: 'King Abdulaziz International Airport',
              location: {
                  lat: 21.675538,
                  lng: 39.170273
              }
          }

      ];


      function initMap() { //inspired by the lessons, modified a bit to add my style of markers and wikipedia api and such.
          // Constructor creates a new map - only center and zoom are required.
          map = new google.maps.Map(document.getElementById('map'), {
              center: {
                  lat: 21.489565,
                  lng: 39.246226
              },
              zoom: 5,
              mapTypeControl: false,
              styles: mapstyle
          });



          // Style the markers a bit. This will be our listing marker icon.
          var defaultIcon = makeMarkerIcon('A52A2A');
          // Create a "highlighted location" marker color for when the user
          // mouses over the marker.
          var highlightedIcon = makeMarkerIcon('00CED1');
          var clickedIcon = makeMarkerIcon('7FFF00');
          var largeInfowindow = new google.maps.InfoWindow();
          // The following group uses the location array to create an array of markers on initialize.
          for (var i = 0; i < locations.length; i++) {
              // Get the position from the location array.
              var position = locations[i].location;
              var title = locations[i].title;


              // Create a marker per location, and put into markers array.
              var marker = new google.maps.Marker({
                  position: position,
                  title: title,
                  animation: google.maps.Animation.DROP,
                  id: i,
                  icon: defaultIcon

              });
              // Push the marker to our array of markers.

              // markers.push(marker);
              marker.defaultIcon = defaultIcon;
              marker.highlightedIcon = highlightedIcon; // saving these icons for later use in showPlace function!
              marker.clickedIcon = clickedIcon;
              // Create an onclick event to open an infowindow at each marker.

              marker.icon=defaultIcon;

              locations[i].marker = marker;
              locations[i].defaultIcon = defaultIcon;
              locations[i].highlightedIcon = highlightedIcon; // saving these icons for later use in showPlace function!
              locations[i].clickedIcon = clickedIcon;
              marker.addListener('click', displayInfo);

              // Two event listeners - one for mouseover, one for mouseout,
              // to change the colors back and forth.
              marker.addListener('mouseover', mouseovered);
              marker.addListener('mouseout', mousedout);
              // markers.push(marker);
              markers[i]=marker;

          }
function displayInfo(){
          console.log(this);
          this.icon = this.clickedIcon;
          this.animation =google.maps.Animation.DROP;
          populateInfoWindow(this, largeInfowindow);

      }
      function mouseovered() {
                  this.setIcon(this.highlightedIcon);
              }
           function mousedout() {
                  this.setIcon(this.defaultIcon);
              }

          showListings();


          //
          var VM = new viewModel();
          
          ko.applyBindings(VM);
      }

      //populating info window
      function populateInfoWindow(marker, infowindow) { // unmodified code from lesson 17 except slightly adding of wikipedia api request to display in the info window
          // Check to make sure the infowindow is not already opened on this marker.

          marker.setIcon(marker.clickedIcon) ;
           console.log(infowindow);
          if (infowindow.marker != marker) {
              infowindow.marker = marker;
              marker.setIcon(marker.clickedIcon);
              // Make sure the marker property is cleared if the infowindow is closed.
              // "https://api.nytimes.com/svc/search/v2/articlesearch.json"
              var wikiURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.title + "&format=json&origin=*&callback=wikiCallback";
              var wikiRequestTimeOut = setTimeout(function(argument) {
                  infowindow.setContent('<div> ' + marker.title + " <p  style=\"font-weight: 900;\" > Failed to load Wikipedia Articles </p>" + "</div>");
                      infowindow.open(map, marker);
              }, 5000);
              $.ajax({
                  url: wikiURL,
                  dataType: "jsonp",
                  success: function(response) {
                      console.log(response);
                      var url = response[3][0];
                      var brief = response[1][0];
                      marker.setIcon(marker.clickedIcon) ;
                      infowindow.setContent('<div> ' + marker.title + " <p  style=\"font-weight: 900;\" > Wikipedia Articles: </p><p><a href=\'" + url + "\'>" + brief + "</a></p>" + "</div>"); /*+" <p>"+marker.label+ '</p>'*/
                      infowindow.open(map, marker);
                      console.log(response[0]);
                      clearTimeout(wikiRequestTimeOut);
                  }


              });
              infowindow.addListener('closeclick', function() {
                infowindow.close();
                marker.animation = null;
                  infowindow.marker = null;
                  // marker.icon= marker.defaultIcon;
                

              });
              infowindow.marker = null;

          }
      }
      // This function will loop through the markers array and display them all.
      function showListings() { //unmodified from lessons 17, 18

          var infowindow = new google.maps.InfoWindow({});
          var bounds = new google.maps.LatLngBounds();
          // Extend the boundaries of the map for each marker and display the marker
          console.log(locations)
          for (var i = 0; i < locations.length; i++) {
              locations[i].marker.setMap(map);
              locations[i].marker.setVisible(true);
              bounds.extend(locations[i].marker.position);
              infowindow.close();

          }
          map.fitBounds(bounds);
      }
      // This function will loop through the listings and hide them all.
      function hideListings() {
          for (var i = 0; i < locations.length; i++) {
              locations[i].marker.setMap(null);
          }
      }

      function makeMarkerIcon(markerColor) { //unmodified except slightly from lessons 17, 18

          var markerImage = new google.maps.MarkerImage(
              'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
              '|40|_|%E2%80%A2',
              new google.maps.Size(21, 34),
              new google.maps.Point(0, 0),
              new google.maps.Point(10, 34),
              new google.maps.Size(21, 34));
          return markerImage;
      }

      var showPlace = function(loc) {
          //we hide all locations first:
          var infowindow = new google.maps.InfoWindow({});

          loc.marker.visible = true;
          // loc.marker.map=map;
          for (i = 0; i < locations.length; i++) {
              locations[i].marker.setMap(null);
          }

          loc.marker.setMap(map);

          if (infowindow.marker != loc.marker) { //unmodified from lessons 17, 18, using the infowindow function
              infowindow.marker = loc.marker;
              loc.marker.setIcon(loc.clickedIcon);
            
              var wikiURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + loc.title + "&format=json&origin=*&callback=wikiCallback";
              var wikiRequestTimeOut = setTimeout(function(argument) {
                 infowindow.setContent('<div> ' + loc.title + " <p  style=\"font-weight: 900;\" > Failed to load Wikipedia Articles </p>" + "</div>");
                      infowindow.open(map, loc.marker);
              }, 5000); // error detection unmodified except a bit, from api lessons
              $.ajax({
                  url: wikiURL,
                  dataType: "jsonp",
                  success: function(response) {
                      var url = response[3][0];
                      var brief = response[1][0];
                      infowindow.setContent('<div> ' + loc.title + " <p  style=\"font-weight: 900;\" > Wikipedia Articles: </p><p><a href=\'" + url + "\'>" + brief + "</a></p>" + "</div>"); /*+" <p>"+marker.label+ '</p>'*/
                      infowindow.open(map, loc.marker);
                      loc.marker.setIcon(loc.marker.clickedIcon);
                      console.log(response[0]);
                      clearTimeout(wikiRequestTimeOut);
                  }


              });
              infowindow.addListener('closeclick', function() {
                  infowindow.close();
                  loc.marker.setIcon(loc.defaultIcon);
              });
          }
          console.log(loc);
          showListings();

      };

      var holder=[];
      var viewModel = function() {
          var self = this; // we use self to access the outer viewModel object
          this.markersloc = ko.observableArray(locations);
          this.markersloc().forEach(function(loc, ind){
            loc.marker= markers[ind];
          });
          this.query= ko.observable('');


          this.resultedLoc= ko.computed(function () {
            if (self.query===''){
              for (i=0; i<markersloc().length; i++){
                markersloc()[i].marker.setVisible(true);
              }
            }
             return ko.utils.arrayFilter(self.markersloc(), function (location) {
              holder=[];
                if (location.title.toLowerCase().indexOf(self.query().toLowerCase())>=0){
                  location.marker.setVisible(true);
                  //console.log(location);
                  return true;
                } else {
                  //console.log(location);
                  location.marker.setVisible(false);
                  return false;
                }

             });
            // body...
          }, self);

      };
