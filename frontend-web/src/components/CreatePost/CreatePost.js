import React from 'react';
import { uid } from "react-uid";
import './CreatePost.css';
import Amplify from 'aws-amplify';
import mapboxgl from 'mapbox-gl';

import Geocoder from 'react-mapbox-gl-geocoder'
 
class CreatePost extends React.Component {
	state = {
		postData: '',
		attachment: undefined,
		lat: undefined,
		long: undefined,
		locName: undefined
	}

	mapAccess = "pk.eyJ1Ijoicnlhbm1hcnRlbiIsImEiOiJjazc5aDZ6Zmgwcno0M29zN28zZHQzOXdkIn0.aXAWfSB_yY8MzA2DajzgBQ"

	postDataChanged = (e) => {
		this.setState({ postData: e.target.value });
	}

	fileUploaded = (e) => {
		try {
			const reader = new FileReader();

			reader.addEventListener("load", () => {
				this.setState({ attachment: reader.result });
			}, false);

			reader.readAsDataURL(e.target.files[0])
		} catch (e) {}
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const imageParam = this.state.attachment ? [ this.state.attachment ] : [];

		const reqParams = { body: { userID: parseInt(this.props.store.userID), content: this.state.postData, images: imageParam } };

		if (this.state.locName && this.state.lat && this.state.long) {
			reqParams.body['location'] = { name: this.state.locName, latitude: this.state.lat.toString(), longitude: this.state.long.toString() }
		}

		reqParams["headers"] = {"Authorization" : this.props.store.session.idToken.jwtToken}

		Amplify.API.post('newPost', '', reqParams).then((response) => {
			this.props.store.updateFeeds();
		}).catch((error) => {
			console.log(error);
		});

		this.setState({ postData: '', attachment: undefined })
		e.target.reset();
	}

	acquiredLocation = (pos) => {
		const latitude  = pos.coords.latitude;
		const longitude = pos.coords.longitude;

		var xhr = new XMLHttpRequest();

		xhr.onload = () => {
			try {
				console.log(JSON.parse(xhr.responseText).features);
				let full_name = JSON.parse(xhr.responseText).features[0].place_name;

				this.setState({ locName: full_name })
			} catch {}
		}

		// Only uses POI (points of interests --> remove this to get the best guess address at current location)
		xhr.open('GET', `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=poi&access_token=pk.eyJ1Ijoicnlhbm1hcnRlbiIsImEiOiJjazc5aDZ6Zmgwcno0M29zN28zZHQzOXdkIn0.aXAWfSB_yY8MzA2DajzgBQ`);
		xhr.responseType = 'text';
		xhr.send();

		this.setState({ lat: latitude, long: longitude });
	}

	componentDidMount() {
		// mapboxgl.accessToken = 'pk.eyJ1Ijoicnlhbm1hcnRlbiIsImEiOiJjazc5aDZ6Zmgwcno0M29zN28zZHQzOXdkIn0.aXAWfSB_yY8MzA2DajzgBQ';
		// var map = new mapboxgl.Map({
		// container: 'map',
		// style: 'mapbox://styles/mapbox/streets-v11',
		// center: [-79.4512, 43.6568],
		// zoom: 13
		// });
		 
		// var geocoder = new mapboxgl.MapboxGeocoder({
		// accessToken: mapboxgl.accessToken,
		// mapboxgl: mapboxgl
		// });
		 
		//document.getElementById('geocoder').appendChild(geocoder.onAdd(map)); 


		navigator.geolocation.getCurrentPosition(this.acquiredLocation, undefined);
	}


	onSelected = (viewport, item) => {
        console.log('Selected: ', item)
	}
	
	render() {
		const queryParams = {
			country: 'us'
		}

		return (
		<form onSubmit={ this.handleSubmit }>
		<div className="CreatePost light-grey-text">
			<div className="TextAreaContainer shadow">
				<textarea id="new-post-textarea" onChange={ this.postDataChanged } placeholder="Share an experience"/>
			</div>
			<div className="CreatePostButtons">
			<div className="PickLocation"><Geocoder
						mapboxApiAccessToken={this.mapAccess} onSelected={this.onSelected} hideOnSelect={true}
						queryParams={queryParams}
					/>
					</div>
				<input id="fileUpload" type="file" name="file" className="hidden" onChange={ this.fileUploaded }/>
				<label htmlFor="fileUpload" className="AttachPicture fa fa-paperclip"></label>
				<input type="submit" className="ShareButton shadow light-grey dark-grey-text" value="Share" />
			</div>
		</div>
		</form>
	)}
};

export default CreatePost;
