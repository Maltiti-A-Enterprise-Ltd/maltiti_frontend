export const load = () => {
  return { type: 'LOAD' };
};

export const unload = () => {
  return { type: 'UNLOAD' };
};

export const setMessages = (message) => {
  return {
    type: 'SET_MESSAGE',
    payload: message
  };
};

export const unsetMessages = () => {
  return {
    type: 'UNSET_MESSAGE'
  };
};

export const error = () => {
  return { type: 'ERROR' };
};

export const info = () => {
  return { type: 'INFO' };
};

export const success = () => {
  return { type: 'SUCCESS' };
};

export const logIn = () => {
  return {
    type: 'LOG_IN'
  };
};

export const logOut = () => {
  return {
    type: 'LOG_OUT'
  };
};

export const searchInput = (input) => {
  return {
    type: 'SEARCH_INPUT',
    payload: input
  };
};

export const setAuth = (input) => {
  return {
    type: 'SET_AUTH',
    payload: input
  };
};

export const unsetAuth = () => {
  return {
    type: 'UNSET_AUTH'
  };
};

export const setProducts = (input) => {
  return {
    type: 'SET_PRODUCTS',
    payload: input
  };
};

export const updateProducts = (input) => {
  return {
    type: 'UPDATE_PRODUCTS',
    payload: input
  };
};

export const deleteProduct = (id) => {
  return {
    type: 'DELETE_PRODUCT',
    payload: { id }
  };
};

export const updateAccessToken = (accessToken) => {
  return {
    type: 'UPDATE_ACCESS_TOKEN',
    payload: accessToken
  };
};

export const updateRoles = (roles) => {
  return {
    type: 'UPDATE_ROLES',
    payload: roles
  };
};

export const setPersist = () => {
  return {
    type: 'SET_PERSIST'
  };
};

export const togglePersist = () => {
  return {
    type: 'TOGGLE_PERSIST'
  };
};
