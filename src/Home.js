import React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";

import "./Home.css";

// get station ids from env vars
const nearStationIds = process.env.REACT_APP_NEAR_STATIONS
  ? process.env.REACT_APP_NEAR_STATIONS.split(",")
  : [];

const Home = () => (
  <Query
    // query to get all the stations
    query={gql`
      {
        bikeRentalStations {
          stationId
          name
          bikesAvailable
          lat
          lon
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error || !nearStationIds.length) return <p>Error :(</p>;

      // filter for just the ids we specified
      const stations = data.bikeRentalStations.filter(({ stationId }) =>
        nearStationIds.includes(stationId)
      );

      const bestStation = stations
        // sort according to order in which they are specified
        .sort(
          ({ stationId: a }, { stationId: b }) =>
            nearStationIds.indexOf(a) - nearStationIds.indexOf(b)
        )
        // sort according to number of available bikes
        .sort(({ bikesAvailable: a }, { bikesAvailable: b }) => b - a)[0];

      // latlon of best station for centering map
      const bestStationPosition = [bestStation.lat, bestStation.lon];

      return (
        <div className="Home">
          <h1 className="Home_title">Where should I go to get a bike?</h1>

          {/* if none have bikes available, get the tram! */}
          {bestStation.bikesAvailable > 0 ? (
            <p className="Home_answer">You should go to {bestStation.name}.</p>
          ) : (
            <p className="Home_answer">You should probably take the tram.</p>
          )}

          {/* display a map centered on the best station */}
          <Map className="Home_map" center={bestStationPosition} zoom={15}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {bestStation.bikesAvailable > 0 && (
              <Marker position={bestStationPosition}>
                <Popup>
                  <p>{bestStation.name}</p>
                </Popup>
              </Marker>
            )}
          </Map>

          {/* display a table of data */}
          <table className="Home_table">
            <thead>
              <tr>
                <th>Station name</th>
                <th>Bikes available</th>
              </tr>
            </thead>
            <tbody>
              {stations.map(({ name, bikesAvailable, stationId }) => (
                <tr key={stationId}>
                  <td>{name}</td>
                  <td>{bikesAvailable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }}
  </Query>
);

export default Home;
