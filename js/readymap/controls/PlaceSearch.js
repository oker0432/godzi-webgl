/**
* ReadyMap/WebGL
* (c) Copyright 2011 Pelican Mapping
* License: LGPL
* http://ReadyMap.org
*/

/**
 * PlaceSearch
 * Geolocator based on Yahoo geocoding
 */

//........................................................................

// Creates style-able input element. Mostly provided as a convenience.
ReadyMap.PlaceSearch = function(parentId, inputId, callback)
{
  if (inputId == undefined)
    inputId = "inputPlaceSearch";
  
  document.getElementById(parentId).innerHTML = 'Search: <input id="' + inputId + '" size="20em" type="text" onkeydown="if(event.keyCode==13) ReadyMap.PlaceSearch.doSearch(value, ' + callback + ');" />';
};

ReadyMap.PlaceSearch.doSearch = function(place, callback)
{
  var pelicanProxyURI = "http://demo.pelicanmapping.com/rmweb/proxy.php";
  var yahooGeocodeURI = "http://local.yahooapis.com/MapsService/V1/geocode";
  var yahooPlaceURI   = "http://wherein.yahooapis.com/v1/document";
  var yahooAppId = "n51Mo.jV34EwZuxIhJ0GqHLzPXoZyjSG6jhLJsQ1v1q975Lf9g7iC4gRYKecVQ--";
  
  if (place != undefined && typeof callback == "function")
  {
    var yahooURI = encodeURI(yahooPlaceURI);
	$.ajax(
	{
	  url:pelicanProxyURI,
	  async: "false",
	  type: "POST",
	  headers: { "Connection": "close" },
	  data:
	  {
	    url: yahooURI, mimeType: "text/xml",
        documentContent: encodeURI(place),
        documentType: "text/plain",
        appid: yahooAppId
	  },

      success: function(data)
	  {
		var xml = data.documentElement;

		try
		{
			var lat = xml.getElementsByTagName("latitude")[0].firstChild.nodeValue;
			var lon = xml.getElementsByTagName("longitude")[0].firstChild.nodeValue;

			var southWest = xml.getElementsByTagName("southWest")[0];
			var swlat = southWest.getElementsByTagName("latitude")[0].firstChild.nodeValue;
			var swlon = southWest.getElementsByTagName("longitude")[0].firstChild.nodeValue;

			var northEast = xml.getElementsByTagName("northEast")[0];
			var nelat = northEast.getElementsByTagName("latitude")[0].firstChild.nodeValue;
			var nelon = northEast.getElementsByTagName("longitude")[0].firstChild.nodeValue;
			  
			callback(lat, lon, swlat, swlon, nelat, nelon, data);
		}
		catch (e)
		{
			callback(0,0,0,0,0,0,"Cannot find location: " + place);
		}
      },
	  
	  error: function(jqXHR, status, error)
	  {
		callback(0,0,0,0,0,0,status);
      }
	});
  }
};