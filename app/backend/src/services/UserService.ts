import IPayloadUser from "../interfaces/IPayloadUser";
import User from "../database/models/User";
import * as bcrypt from 'bcryptjs'
import generateJwt from "../utils/generateJwt";

export default class UserService {
  public login = async (payloadUser: IPayloadUser) => {
    const user = await User.findOne({ where: { email: payloadUser.email } })

    if(user !== null) {
      const isValidPassword = await bcrypt.compare(payloadUser.password, user.password)
      const payload = {
        id: user.id,
        email: user.email
      }

      return isValidPassword ? { message: { token: generateJwt(payload) }, statusCode: 200 }
        : { message: 'Invalid credentials', statusCode: 403 }
    } return { message: 'User not found', statusCode: 404 }
  }
}