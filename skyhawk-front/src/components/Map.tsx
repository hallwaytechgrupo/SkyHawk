import {useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYm9pdGF0YSIsImEiOiJjbTlrZGF3ejgwb2FxMnJvYWZ1Z3pudndpIn0.EiV7WmRDDZZBkY2A0PSJ1A';

const Map = () => {
	const mapContainer = useRef<HTMLDivElement>(null);

	useEffect(()=>{
		if(!mapContainer.current) return;

		const map = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/dark-v11',
			center:[-46.6333,-23.5505],
			zoom:7,
			});
		map.on('click', (e) => {
			const {lng,lat} = e.lngLat;
			console.log(`ponto selecionado: ${lng} , ${lat}`);
			new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
			});

		return () => map.remove();
	}, []);
	
	return <div ref={mapContainer} style={{width:'100%', height:'98%'}} />
	};

export default Map;
