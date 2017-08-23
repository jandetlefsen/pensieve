import axios from 'axios';
import {
	CREATE_ITEM,
	FETCH_ITEMS,
	FETCH_DUE_ITEMS,
	FETCH_ITEM,
	REVIEW_ITEM,
	EDIT_ITEM,
	DELETE_ITEM,
	ITEM_ERROR,
	UPDATE_MESSAGE
} from './types';
import cookie from 'react-cookie';

const ITEMS_API = `/api/items`;
const DUE_ITEMS_API = '/api/due_items';

export const fetchItems = () => dispatch => {
	const config = { headers: { Authorization: cookie.load('token') } };

	axios
		.get(ITEMS_API, config)
		.then(resp => dispatch({ type: FETCH_ITEMS, payload: resp.data }))
		.catch(error => dispatch({ type: ITEM_ERROR, payload: { error: error.response } }));
};

export const fetchItem = itemId => dispatch => {
	const config = { headers: { Authorization: cookie.load('token') } };

	axios
		.get(`${ITEMS_API}/${itemId}`, config)
		.then(resp => dispatch({ type: FETCH_ITEM, payload: resp.data }))
		.catch(error => dispatch({ type: ITEM_ERROR, payload: { error: error.response } }));
};

export const fetchDueItems = () => dispatch => {
	const config = { headers: { Authorization: cookie.load('token') } };

	axios
		.get(DUE_ITEMS_API, config)
		.then(resp => dispatch({ type: FETCH_DUE_ITEMS, payload: resp.data }))
		.catch(error => dispatch({ type: ITEM_ERROR, payload: { error: error.response } }));
};

export const createItem = params => dispatch => {
	const config = { headers: { Authorization: cookie.load('token') } };

	axios
		.post(ITEMS_API, params, config)
		.then(resp => dispatch({ type: CREATE_ITEM, payload: resp.data }))
		.catch(error => dispatch({ type: ITEM_ERROR, payload: { error: error.response } }));
};

export const reviewItem = params => dispatch => {
	const config = { headers: { Authorization: cookie.load('token') } };
	const route = `/api/items/${params.itemId}/review`;

	axios
		.post(route, params, config)
		.then(resp => dispatch({ type: REVIEW_ITEM, payload: resp.data }))
		.catch(error => dispatch({ type: ITEM_ERROR, payload: { error: error.response } }));
};

export const toggleHideItem = item => dispatch => {
	const config = { headers: { Authorization: cookie.load('token') } };
	const route = `${ITEMS_API}/${item._id}`;
	const params = { hidden: !item.hidden };

	axios
		.put(route, params, config)
		.then(resp => dispatch({ type: EDIT_ITEM, payload: { item: resp.data.item } }))
		.catch(error => dispatch({ type: ITEM_ERROR, payload: { error: error.response } }));
};

export const editItem = params => dispatch => {
	const config = { headers: { Authorization: cookie.load('token') } };
	const route = `${ITEMS_API}/${params.itemId}`;

	axios
		.put(route, params, config)
		.then(resp => {
			dispatch({ type: EDIT_ITEM, payload: { item: resp.data.item } });
			dispatch({
				type: UPDATE_MESSAGE,
				payload: { message: 'Your well thought out changes were successfully saved!' }
			});
		})
		.catch(error => dispatch({ type: ITEM_ERROR, payload: { error: error.response } }));
};

export const deleteItem = itemId => dispatch => {
	const config = { headers: { Authorization: cookie.load('token') } };
	const route = `${ITEMS_API}/${itemId}`;

	axios
		.delete(route, config)
		.then(() => {
			dispatch({ type: DELETE_ITEM, payload: { itemId } });
			dispatch({
				type: UPDATE_MESSAGE,
				payload: { message: 'That item was wiped from memory.' }
			});
		})
		.catch(error => dispatch({ type: ITEM_ERROR, payload: { error: error.response } }));
};
