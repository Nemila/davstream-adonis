import playerService from '#services/database/player_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class PlayersController {
  getPlayers = async () => {}

  getDirectLinks = async (c: HttpContext) => {
    const episodeId = Number(c.request.qs().episodeId)
    const mediaId = Number(c.request.qs().mediaId)

    if (episodeId && mediaId) throw new Error('Invalid parameters')
    if (!episodeId && !mediaId) throw new Error('Missing required parameters')

    const players = await playerService.getAllMediaLinks(
      episodeId || mediaId,
      episodeId ? 'TV' : 'MOVIE'
    )
    return players
  }
}
