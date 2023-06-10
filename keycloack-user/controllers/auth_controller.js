const axios = require("axios");
const jwt = require("jsonwebtoken");
const adminLogin = require("../variables").adminLogin;
const userLogin = require("../variables").userLogin;
const roles = require("../variables").roles;
const HttpError = require("../models/httpError-model");
const { errorMessages, URLS } = require("../variables");

const getUserByName = async (name, accessToken) => {
  //teacher can do this
  let response;

  try {
    response = await axios({
      method: "GET",
      url: URLS.users,
      params: {
        username: name,
      },
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  } catch (err) {
    response = err.response;
  }

  if (!response.data.length) {
    return {
      err: errorMessages.couldnotSetRoles,
    };
  }

  return response.data[0];
};

const setRoles = async (userId, userType, accessToken) => {
  let response;

  try {
    response = await axios({
      method: "POST",
      url:
        URLS.users +
        userId +
        "/role-mappings/realm",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      data: [{ id: roles[userType].id, name: roles[userType].name }],
    });
  } catch (err) {
    response = err.response;
  }

  if (response.data.error) {
    return { err: response.data.error, code: response.status };
  }

  return response;
};

const getAccessToken = async () => {
  let response;

  try {
    console.log(adminLogin)
    response = await axios({
      method: "POST",
      url: URLS.login,
      data: {
        ...adminLogin,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  } catch (err) {
    response = err;
  }

  if (response.response?.data?.error) {
    return { err: response.response?.data?.error };
  }

  return response.data.access_token;
};

const getAllUsers = async (req, res, next) => {
  //teacher no can do this
  const accessToken = await getAccessToken();

  if (accessToken.err) {
    return next(new HttpError(accessToken.err, 501));
  }

  let response;
  try {
    response = await axios({
      method: "GET",
      url: URLS.users,
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  } catch (err) {
    response = err.response;
  }

  if (response.data.error) {
    return next(new HttpError(response.data.error, response.status));
  }

  res.json(response.data).status(response.status);
};

const getUsersByRole = async (req, res, next) => {
  const role = req.params.role;

  const accessToken = await getAccessToken();

  if (accessToken.err) {
    return next(new HttpError(accessToken.err, 501));
  }

  let response;
  try {
    response = await axios({
      method: "GET",
      url:
        URLS.roles +
        role +
        "/users",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  } catch (err) {
    response = err.response;
  }

  if (response.data.error) {
    return next(new HttpError(response.data.error, response.status));
  }

  res.json(response.data).status(response.status);
};

const refresh_token = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  let response;
  try {
    response = await axios({
      method: "POST",
      url: URLS.login,
      data: {
        ...adminLogin,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  } catch (err) {
    response = {
      err:
        err.response.data.error_description + " \n " + err.response.data.error,
      code: err.response.status,
    };
  }

  if (response.err) {
    return next(new HttpError(response.err, response.code));
  }

  res.json(response.data);
};

const register = async (req, res, next) => {
  userData = req.body;
  const accesstoken = await getAccessToken();

  if (accesstoken.err) {
    return next(new HttpError(accesstoken.err, 501));
  }

  let userCreated;
  try {
    userCreated = await axios({
      method: "POST",
      url: URLS.users,
      data: {
        enabled: true,
        groups: [],
        email: userData.email,
        emailVerified: "",
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.userName,
        credentials: [
          { type: "password", value: userData.password, temporary: false },
        ],
      },
      headers: {
        Authorization: "Bearer " + accesstoken,
      },
    });
  } catch (err) {
    userCreated = {
      err: err.response.data.errorMessage,
      code: err.response.status,
    };
  }

  if (userCreated.code) {
    return next(new HttpError(userCreated.err, userCreated.code));
  }

  const user = await getUserByName(userData.userName, accesstoken);

  if (user.err) {
    return next(new HttpError(user.err, 501));
  }

  const userRoles = await setRoles(user.id, userData.userType, accesstoken);

  if (userRoles.err) {
    return next(
      new HttpError(
        errorMessages.couldnotSetRoles,
        501
      )
    );
  }

  res.json("user created sucssessfully ").status(201);
};

const login = async (req, res, next) => {
  let response;
  
  const userData = req.body;
  try {
    response = await axios({
      method: "POST",
      url: URLS.login,
      data: {
        ...userLogin,
        username: userData.userName,
        password: userData.password,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  } catch (err) {
    
    response = { err: err };
  }

  if (response.err) {
    return next(
      new HttpError(
        response.err.response?.status
          ? errorMessages.wrong_userName_Passwrod
          : errorMessages.keyCloack_Not_Working,
        response.err.response?.status || 501
      )
    );
  }

  const decodedAccessToken = jwt.decode(response.data.access_token);

  if (decodedAccessToken.realm_access.roles.includes("TEACHER")) {
    response.data.userType = "teacher";
  } else if (decodedAccessToken.realm_access.roles.includes("admin")) {
    response.data.userType = "admin";
  } else {
    response.data.userType = "student";
  }

  const accessToken = await getAccessToken();

  if (accessToken.err) {
    console.log(accessToken.err)
    return next(new HttpError(accessToken.err, 501));
  }

  const user = await getUserByName(userData.userName, accessToken);

  if (user.err) {
    return next(new HttpError(user.err, 501));
  }

  response.data.userId = user.id;
  response.data.firstName = user.firstName;
  response.data.lastName = user.lastName;

  res.json(response.data).status(200);
};

const logout = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  try {
    response = await axios({
      method: "POST",
      url: URLS.logout,
      data: {
        ...userLogin,
        refresh_token: refreshToken,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  } catch (err) {
    response = err;
  }

  res.json("loggedout").status(200);
};

const assignRoles = async (req, res, next) => {
  const userId = req.params.uid;
  const { role } = req.body;
  const accessToken = getAccessToken();

  if (accessToken.err) {
    return next(new HttpError(accessToken.err, 501));
  }

  if (!role) {
    return next(new HttpError(errorMessages.invalid_Role, 400));
  }

  const roleSat = setRoles(userId, role, accessToken);

  if (roleSat.err) {
    return next(new HttpError(roleSat.err, roleSat.code));
  }

  res.json("role have been added");
};

module.exports = {
  register,
  login,
  assignRoles,
  getAllUsers,
  getUsersByRole,
  logout,
  refresh_token,
};
