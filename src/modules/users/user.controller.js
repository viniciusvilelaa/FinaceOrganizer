import { ApiError } from "../../utils/api-error.js"
import * as userServices from "../users/user.service.js"
import { userCreateSchema, userLoginSchema } from "./user.schema.js"

//Helper para nao repetir codigo em login/logout/register
function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: '/',
  }
}


//HTTP REQUEST POST
export const createUser = async (req, res) => {
  try {
    const bodyParsed = userCreateSchema.safeParse(req.body);

    if (!bodyParsed.success) {
      return res.status(400).json({
        message: 'Invalid inputs for create a user',
        error: bodyParsed.error.flatten().fieldErrors
      });
    }

    const { user, token } = await userServices.createUser(bodyParsed.data);

    res.cookie("auth_token", token, getCookieOptions());

    return res.status(201).json({ user });

  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}

//HTTP REQUEST LOGIN
export const loginUser = async (req, res) => {
  try {
    const bodyParsed = userLoginSchema.safeParse(req.body);

    if (!bodyParsed.success) {
      return res.status(400).json({
        message: 'Invalid inputs for login',
        error: bodyParsed.error.flatten().fieldErrors
      });
    }
    const { user, token } = await userServices.loginUser(bodyParsed.data);

    res.cookie("auth_token", token, getCookieOptions());

    return res.status(200).json({ user });

  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}

//HTTP REQUEST USER LOGOUT
export const logoutUser = async (req, res) => {
  res.cookie("auth_token", '', { ...getCookieOptions(), maxAge: 0 });

  return res.status(200).json({ message: "Successful logout" });

}

//HTTP REQUEST GET
export async function getUsers(req, res, next) {

  const users = await userServices.getAllUsers();
  return res.status(200).json(users);
}

//HTTP REQUEST GET /ME
export const getMe = async (req, res) => {
  const userId = req.user?.sub;
  const user = await userServices.getMe(userId);

  return res.status(200).json(user);
}

