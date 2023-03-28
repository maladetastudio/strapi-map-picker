import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { Field, FieldLabel, FieldHint, FieldError, FieldInput, Box, Flex } from '@strapi/design-system';

import 'leaflet/dist/leaflet.css';

const MapPicker = ({
	value,
	onChange,
	name,
	intlLabel,
	required,
	attribute,
	description,
	placeholder,
	disabled,
	error,
}) => {
	const [selectedCoordinates, setSelectedCoordinates] = useState({ latitude: parseFloat((value ?? "51.505;-0.09").split(';')[0]), longitude: parseFloat((value ?? "51.505;-0.09").split(';')[1]) ?? -0.09 })

	const LocationMarker = ({ selectedCoordinates, setSelectedCoordinates }) => {
		const map = useMapEvents({
			click(e) {
				setSelectedCoordinates({ latitude: e.latlng.lat, longitude: e.latlng.lng })
				onChange({ target: { name, value: Object.values(selectedCoordinates).join(';'), type: attribute.type } })
			},
		})

		useEffect(() => {
			if (selectedCoordinates) {
				map.panTo(Object.values(selectedCoordinates))
			}
		}, [selectedCoordinates])

		return (<Marker position={[selectedCoordinates.latitude, selectedCoordinates.longitude]} />)
	}

	return <Field name="map" required={false}>
		<Flex direction="column" alignItems="flex-start" gap={1}>
			<FieldLabel>Map</FieldLabel>
			<div style={{ width: '100%', height: '500px' }}>
				<MapContainer center={[selectedCoordinates.latitude, selectedCoordinates.longitude]} zoom={13} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<LocationMarker selectedCoordinates={selectedCoordinates} setSelectedCoordinates={setSelectedCoordinates} />
				</MapContainer>
			</div>
			<Flex direction="row" alignItems="flex-start" gap={1}>
				<Flex direction="column" alignItems="flex-start" gap={1}>
					<FieldLabel>Latitude</FieldLabel>
					<FieldInput type="float" placeholder="42.70551143750671" value={selectedCoordinates.latitude}
						onChange={(e) => {
							setSelectedCoordinates({ ...selectedCoordinates, latitude: e.target.value })
							onChange({ target: { name, value: Object.values({ ...selectedCoordinates, latitude: e.target.value }).join(';'), type: attribute.type } })
						}}
					/>
				</Flex>
				<Flex direction="column" alignItems="flex-start" gap={1}>
					<FieldLabel>Longitude</FieldLabel>
					<FieldInput type="float" placeholder="0.7856020890462989" value={selectedCoordinates.longitude}
						onChange={(e) => {
							setSelectedCoordinates({ ...selectedCoordinates, longitude: e.target.value })
							onChange({ target: { name, value: Object.values({ ...selectedCoordinates, latitude: e.target.value }).join(';'), type: attribute.type } })
						}}
					/>
				</Flex>
			</Flex>
		</Flex>
		<FieldHint />
		<FieldError />
	</Field>;
};

export default MapPicker;