import * as userServices from "../users/user.service.js"

//HTTP REQUEST POST
export const createUser =  async (req, res) => {
  const { name, email, password } = req.body;
  const result = await userServices.createUser({ name, email, password });

  return res.status(201).json(result);
}

//HTTP REQUEST GET
export async function getUsers (req, res, next){
    try{
        const user = await userServices.getAllUsers()
        return res.status(201).json(result);
    }catch(err){
        next(err)
    }
}
