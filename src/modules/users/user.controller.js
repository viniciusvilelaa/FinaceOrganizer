import * as userServices from "../users/user.service.js"

//Helper para nao repetir codigo em login/logout/register
function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'

  return {
    httpOnly: true,               // JS não consegue ler — proteção contra XSS
    secure: isProd,               // Só HTTPS em produção
    sameSite: 'lax',              // Proteção contra CSRF
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias em milissegundos
    path: '/',                    // Válido para todas as rotas
  }
}


//HTTP REQUEST POST
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await userServices.createUser({ name, email, password });

  res.cookie("auth_token", token, getCookieOptions());

  return res.status(201).json({ user });
}

//HTTP REQUEST LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await userServices.loginUser({ email, password });

  res.cookie("auth_token", token, getCookieOptions());

  return res.status(200).json({ user });
}

//HTTP REQUEST USER LOGOUT
export const logoutUser = async (req, res) => {
    res.cookie("auth_token", '', {...getCookieOptions(), maxAge: 0});

    return res.status(200).json({message: "Successful logout"});

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

