import {
  OPEN_ACCOUNT_FORM,
  CLOSE_ACCOUNT_FORM,
  GET_ALL_ACCOUNT,
  UPDATE_ACCOUNT,
  INVALID_ACCOUNT_PARAMS,
} from './actions';

const initialAccountFormState = { visible: false, errors: [] };
const initialAccountState = { users: [] };

export const accountFormReducer = (state = initialAccountFormState, action) => {
  switch (action.type) {
    case OPEN_ACCOUNT_FORM:
      return { visible: true, errors: [] };
    case CLOSE_ACCOUNT_FORM:
      return { visible: false, errors: [] };
    case INVALID_ACCOUNT_PARAMS:
      return { visible: state.visible, errors: action.errors };
    default:
      return state;
  }
};

export const accountReducer = (state = initialAccountState, action) => {
  switch (action.type) {
    case GET_ALL_ACCOUNT:
      return { users: action.users };
    case UPDATE_ACCOUNT:
      return {
        ...state,
        users: state.users.map((user) => (
          user.id === action.user.id ? action.user : user
        )),
      };
    default:
      return state;
  }
};
