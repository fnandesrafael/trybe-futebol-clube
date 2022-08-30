import IPayloadUser from "../interfaces/IPayloadUser";
import User from "../database/models/User";
import * as bcrypt from 'bcryptjs'
import generateJwt from "../utils/generateJwt";

export default class UserService {
  public login = async (payloadUser: IPayloadUser) => {
    if(!payloadUser.email || !payloadUser.password) {
      return { message: "All fields must be filled" , statusCode: 400 }
    }

    const user = await User.findOne({ where: { email: payloadUser.email } })

    if(user !== null) {
      const isValidPassword = await bcrypt.compare(payloadUser.password, user.password)
      const payload = {
        id: user.id,
        email: user.email
      }

      return isValidPassword ? { message: { token: generateJwt(payload) }, statusCode: 200 }
        : { message: 'Incorrect email or password', statusCode: 401 }
    } return { message: 'Incorrect email or password', statusCode: 401 }
  }
}