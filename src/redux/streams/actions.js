import _ from 'lodash';
import axios from '../../utils/axios';

//TODO remove when API call works
import EXAMPLE_STREAMS_API_RESPONSE from '../../example-api-responses/streams';

export const STREAMS_TYPES = {
  FETCH_STREAMS: 'FETCH_STREAMS',
  FETCHING_STREAMS: 'FETCHING_STREAMS',
  FETCH_STREAM: 'FETCH_STREAM',
  FETCH_AVAILABLE_STREAM_TYPES: 'FETCH_AVAILABLE_STREAM_TYPES',
  UPDATED_FILTER: 'UPDATED_FILTER'
};

export const STREAMS_ACTIONS = {
  fetchStreams: async (dispatch, filter = {}) => {
    dispatch({
      type: STREAMS_TYPES.FETCHING_STREAMS,
      value: true
    });

    let filterUrlQuery = "";
    if(filter.types && filter.types.length === 1)
      filterUrlQuery = `type=${filter.types[0]}`;
    else
      filterUrlQuery = _.map(filter.types,(type) => {return `type[]=${type}`}).join("&");

    const authenticatedAxiosClient = axios(null,true);
    // const response = await authenticatedAxiosClient.get(
    //   `/streamregistry/list?limit=5000&${filterUrlQuery}`
    // );

    const response = JSON.parse(EXAMPLE_STREAMS_API_RESPONSE);

    //50.860,4.647
    // const response = await authenticatedAxiosClient.get(
    //   `/streamregistry/list?near=50.87,4.70,100`
    // );

    const parsedResponse = {};
    _.each(response.items, (item) => {
        parsedResponse[item.key] = {
          id:item._id,
          key:item.key,
          name:item.name,
          type:item.type,
          price:item.price,
          stake:item.stake,
          example:item.example,
          geometry:{
            "type": "Point",
            "coordinates": [item.geo.lng, item.geo.lat]
          }
        };
    });

    dispatch({
      type: STREAMS_TYPES.FETCH_STREAMS,
      streams: parsedResponse
    });
  },
  fetchStream: async (dispatch, streamKey) => {
    const authenticatedAxiosClient = axios(null,true);
    const response = await authenticatedAxiosClient.get(
      `/streamregistry/list/${streamKey}`
    );

    const responseStream = response.data;
    const parsedResponse = {
      id:responseStream._id,
      key:responseStream.key,
      name:responseStream.name,
      type:responseStream.type,
      price:responseStream.price,
      stake:responseStream.stake,
      example:responseStream.example,
      geometry:responseStream.geo
    };

    dispatch({
      type: STREAMS_TYPES.FETCH_STREAM,
      stream: parsedResponse
    });
  },
  fetchAvailableStreamTypes: (dispatch) => {
    dispatch({
      type: STREAMS_TYPES.FETCH_AVAILABLE_STREAM_TYPES,
      availableStreamTypes: {
        temperature: {
          id:'temperature',
          name:'Temperature'
        },
        humidity: {
          id:'humidity',
          name:'Humidity'
        },
        PM10: {
          id:'PM10',
          name:'PM10'
        },
        'PM25': {
          id:'PM25',
          name:'PM25'
        }
      }
    });
  },
  updateFilter: (dispatch, filter) => {
    dispatch({
      type: STREAMS_TYPES.UPDATED_FILTER,
      filter //ES6 syntax sugar
    });

    STREAMS_ACTIONS.fetchStreams(dispatch, filter);
  }
};
