const bcrypt = require("bcrypt");
const User = require("../module/User");
const jwt = require("jsonwebtoken");

const token = ({ email, role }) => {
  return jwt.sign({ email, role }, process.env.key, { expiresIn: "48h" });
};

class AuthController {
  async register(req, res) {
    try {
      const { email, password, role } = req.body;
      const checkUser = await User.findOne({ where: { email } });
      if (!email || !password) {
        res.json({ message: "Email и password обязательны" });
      }
      if (checkUser) {
        return res.json({ message: "Такой пользователь уже существует" });
      }
      const hashPassword = await bcrypt.hash(password, 12);
      const data = await User.create({ email, password: hashPassword, role });
      const jwtToken = await token({ email, role });
      return res.json({ jwtToken });
    } catch (e) {
      console.error(e);
    }
  }
  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.json({ message: "Email и password обязательны" });
    }
    const data = await User.findOne({ where: { email } });
    if (!data) {
      return res.json({ message: "Такого пользователя не существует" });
    }
    const checkPassword = await bcrypt.compareSync(password, data.password);
    if (!checkPassword) {
      return res.json({ message: "Неверный пароль" });
    }
    const jwtToken = await token({ email, role: data.role });
    return res.json({ jwtToken });
  }
  async User(req, res) {
    const { email } = req.query;
    if (email) {
      const data = await User.findOne({ where: { email } });
      if (data) {
        return res.json({ data });
      }
    }
  }
}
module.exports = new AuthController();
