import { combineReducers } from 'redux';

const reducers = combineReducers({
    // Dummy reducer, will be placeholder for apps where redux is not needed at first,
    // but you still want to keep it.
    dummy: (state = {}) => state,
});

export default reducers;
