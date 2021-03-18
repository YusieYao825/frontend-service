import axios from 'axios';
import { fromJS } from 'immutable';

export const GET_USER_REQUESTS = 'content/GET_USER_REQUESTS';
export const SET_REQUEST_DETAIL = 'content/SET_REQUEST_DETAIL';
export const BACK_TO_REQUESTS = 'content/BACK_TO_REQUESTS';
export const CHANGE_TO_LOGOUT = 'content/CHANGE_TO_LOGOUT';

export const backToRequests = () => ({
    type: BACK_TO_REQUESTS
});

export const logout = () => ({
    type: CHANGE_TO_LOGOUT
})

const getUserRequestsAction = (data) => ({
    type: GET_USER_REQUESTS,
    data: fromJS(data)
});

const setRequestDetailAction = (data) => ({
    type: SET_REQUEST_DETAIL,
    data: fromJS(data)
});

export const getUserRequests = (userNetId) => {
    return (dispatch) => {
        axios.get(`http://localhost:8080/api/getUserRequests/${userNetId}`)
            .then(res => {
                console.log(res.data)
                dispatch(getUserRequestsAction(res.data))
            })
            .catch((error) => {
                console.log(error)
            })
    }
};

export const changeDetailId = (id) => {
    return (dispatch) => {
        axios.get(`http://localhost:8080/api/getRequestDetail/${id}`)
            .then(res => {
                console.log(res.data)
                dispatch(setRequestDetailAction(res.data))
            })
            .catch((error) => {
                console.log(error)
            })
    }
}