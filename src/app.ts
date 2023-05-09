import axios from 'axios';

const GOOGLE_API_KEY = '#';
declare var google: any;
let map: google.maps.Map;
interface GoogleMapsResponse {
  results: { geometry: { location: { lat: number, lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS'
}

const form = document.querySelector('form');
const addressInput = document.getElementById('address')! as HTMLInputElement;

const searchAddressHandler = async (event: Event) => {
  event.preventDefault();
  const address = addressInput.value;
  const api = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${GOOGLE_API_KEY}`;

  try {
    const { data } = await axios.get<GoogleMapsResponse>(api);
    if (data.status !== 'OK') {
      throw new Error("Something went wrong!");
      
    }
    const coordinates = data?.results[0]?.geometry?.location;
    
    async function initMap(): Promise<void> {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    
      map = new Map(
        document.getElementById('map') as HTMLElement,
        {
          zoom: 8,
          center: coordinates,
          mapId: 'DEMO_MAP_ID',
        }
      );
    
      new AdvancedMarkerElement({
        map: map,
        position: coordinates,
        title: 'Place'
      });
    }

    initMap();

  } catch (error) {
    console.log(error);
  }
};

form?.addEventListener('submit', searchAddressHandler);
