import {
	CREATE_ITEM, FETCH_DUE_ITEMS, FETCH_ITEMS, FETCH_ITEM, EDIT_ITEM, DELETE_ITEM,
	CREATE_SESSION, FETCH_SESSIONS, FETCH_SESSION, FINISH_SESSION,
	FETCH_DECKS
} from '../actions/types';

const INITIAL_STATE = {};

export default function (state = INITIAL_STATE, action) {
	switch (action.type) {
		case FETCH_SESSIONS:
			return { ...state, sessions: action.payload.sessions };
		case FETCH_SESSION:
			return { ...state, session: action.payload.session };
		case CREATE_SESSION:
			return {...state, session: action.payload.session, message: action.payload.message };
		case FINISH_SESSION:
			return {...state, session: action.payload.session, message: action.payload.message };

		case FETCH_ITEMS:
			return { ...state, items: action.payload.items };
		case FETCH_DUE_ITEMS:
			return { ...state, due_items: action.payload.due_items };
		case FETCH_ITEM:
			return { ...state, item: action.payload.item };

    case FETCH_DECKS:
     return { ...state, decks: action.payload.decks };

		case CREATE_ITEM: {
			const newItem = action.payload.item;
			return { ...state, item: newItem, items: [ ...state.items, newItem ], message: action.payload.message };
		}
		case EDIT_ITEM: {
			const updatedItem = action.payload.item;
			const updatedItems = (state.items || []).map(item =>
				item._id === updatedItem._id ? updatedItem : item
			);
			return { ...state, item: updatedItem, items: updatedItems, message: action.payload.message };
		}
		case DELETE_ITEM: {
			const items = (state.items || []).filter(item => item._id != action.payload.itemId );
			return { ...state, item: {}, items: items };
		}
	}

	return state;
}
