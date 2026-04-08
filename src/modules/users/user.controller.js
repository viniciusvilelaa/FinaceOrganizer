import * as userServices from "../users/user.service.js"

//HTTP REQUEST POST
export const createUser =  async (req, res) => {
  const { name, email, password } = req.body;
  const result = await userServices.createUser({ name, email, password });

  return res.status(201).json(result);
}

//HTTP REQUEST GET
export async function getUsers (req, res, next){
    
    const users = await userServices.getAllUsers();
    return res.status(200).json(users);
}

//HTTP REQUEST GET /ME
export const getMe = async (req, res) => {
  const userId = req.user?.sub;
  const user = await userServices.getMe(userId);

  return res.status(200).json(user);
}

//HTTP REQUEST LOGIN
export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    const result = await userServices.loginUser({ email, password });

    return res.status(200).json(result);
}