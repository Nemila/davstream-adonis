import seasonService from '#services/database/season_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class SeasonsController {
  getMediaSeasons = async ({ params }: HttpContext) => {
    const mediaId = Number(params.mediaId)
    return await seasonService.getMediaSeasons(mediaId)
  }
  getSeasonDetails = async ({ params }: HttpContext) => {
    const mediaId = Number(params.mediaId)
    const seasonNumber = Number(params.seasonNumber)
    return await seasonService.getDetails({ mediaId, seasonNumber })
  }
}
