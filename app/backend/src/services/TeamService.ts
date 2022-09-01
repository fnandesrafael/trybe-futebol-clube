import Team from '../database/models/Team'

export default class TeamService {
  public getAll = async () => {
      const teams = await Team.findAll()
      return { statusCode: 200, message: teams }
  }
}