import Team from '../database/models/Team'

export default class TeamService {
  public getAll = async () => {
    try {
      const teams = await Team.findAll()
      return { statusCode: 200, message: teams }
    } catch(err) {
      console.log(err)
      return { statusCode: 400, message: 'Internal server error' }
    }
  }
}