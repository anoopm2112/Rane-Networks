import createDataContext from './createDataContext';

const authReducer = (state, action) => {
    switch (action.type) {
        case 'signout':
            return { userToken: '', userName: '', userEmail: '', defaultBrief: {} };
        case 'signin':
            return {
                userToken: action.payload.userToken,
                userName: action.payload.userName,
                userEmail: action.payload.userEmail,
                defaultBrief: action.payload.defaultBrief,
            };
        default:
            return state;
    }
};

const signin = dispatch => {
    return ({ userToken, userName, userEmail, defaultBrief }) => {
        dispatch({
            type: 'signin',
            payload: { userToken, userName, userEmail, defaultBrief }
        });
    };
};

const signout = dispatch => {
    return () => {
        dispatch({ type: 'signout' });
    };
};

export const { Provider, Context } = createDataContext(authReducer, { signin, signout }, { userToken: '', userName: '', userEmail: '', defaultBrief: {} });