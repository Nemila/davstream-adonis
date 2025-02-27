import mediaService from '#services/database/media_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class MediaController {
  getPopular = async (c: HttpContext) => {
    const page = Number(c.request.qs().page) || 1
    const limit = Number(c.request.qs().limit) || 30

    const { populars, count } = await mediaService.getPopulars({ limit, page })
    const totalPages = Math.floor(count / limit)

    return {
      page,
      totalPages,
      totalResults: count,
      results: populars,
    }
  }

  getTrending = async (c: HttpContext) => {
    const page = Number(c.request.qs().page) || 1
    const limit = Number(c.request.qs().limit) || 30

    const { trending, count } = await mediaService.getTrending({ limit, page })
    const totalPages = Math.floor(count / limit)

    return {
      page,
      totalPages,
      totalResults: count,
      results: trending,
    }
  }

  getMediaDetails = async ({ params }: HttpContext) => {
    const id = Number(params.id)
    const media = await mediaService.findById(id)
    if (!media) throw new Error('Media not found')
    return media
  }

  getRecommendations = async ({ params }: HttpContext) => {
    const id = Number(params.id)
    return await mediaService.getRecommendations(id)
  }

  getSimilars = async ({ params }: HttpContext) => {
    const id = Number(params.id)
    return await mediaService.getSimilars(id)
  }

  searchMedia = async (c: HttpContext) => {
    const page = Number(c.request.qs().page) || 1
    const limit = Number(c.request.qs().limit) || 30

    const query = decodeURIComponent(c.request.qs().q)
    if (!query || !query.trim()) throw new Error('Query is required')

    const { count, results } = await mediaService.search({
      query,
      limit,
      page,
    })
    const totalPages = Math.floor(count / limit)
    return { page, totalPages, totalResults: count, results }
  }
}
