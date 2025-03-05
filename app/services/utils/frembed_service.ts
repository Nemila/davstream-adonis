import { z } from 'zod'
import Limit from 'p-limit'
const limit = Limit(10)

const watchMovieSchema = z.object({
  link1: z.string().nullable().optional(),
  link2: z.string().nullable().optional(),
  link3: z.string().nullable().optional(),
  link4: z.string().nullable().optional(),
  link5: z.string().nullable().optional(),
  link6: z.string().nullable().optional(),
  link7: z.string().nullable().optional(),
  link1vostfr: z.string().nullable().optional(),
  link2vostfr: z.string().nullable().optional(),
  link3vostfr: z.string().nullable().optional(),
  link4vostfr: z.string().nullable().optional(),
  link5vostfr: z.string().nullable().optional(),
  link6vostfr: z.string().nullable().optional(),
  link7vostfr: z.string().nullable().optional(),
  link1vo: z.string().nullable().optional(),
  link2vo: z.string().nullable().optional(),
  link3vo: z.string().nullable().optional(),
  link4vo: z.string().nullable().optional(),
  link5vo: z.string().nullable().optional(),
  link6vo: z.string().nullable().optional(),
  link7vo: z.string().nullable().optional(),
  version: z.string().nullable().optional(),
  quality: z.string().nullable().optional(),
  qualityVostfr: z.string().nullable().optional(),
  qualityVo: z.string().nullable().optional(),
})

// interface MovieOptions {
//   order: 'latest' | 'popular' | 'update' | 'year'
//   limit: number
//   page: number
// }

class FrembedService {
  private readonly API_URL = 'https://api.frembed.xyz'
  private readonly BASE_URL = 'https://frembed.xyz/api'

  private readonly HEADERS = {
    'accept': '*/*',
    'alt-used': 'frembed.xyz',
    'accept-language': 'en-US,en;q=0.5',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'priority': 'u=4',
    'pragma': 'no-cache',
    'cache-control': 'no-cache',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0',
    'Accept-Language': 'en-US,en;q=0.9',
    'referer': 'https://frembed.xyz/films?id=1132497',
  }

  private async fetchWithHeaders(url: string) {
    const response = await fetch(url, { headers: this.HEADERS })
    const data = response.json()
    return data
  }

  private async getMovieData(tmdbId: number) {
    const endpoint = `${this.BASE_URL}/films?id=${tmdbId}&idType=tmdb`
    const json = await this.fetchWithHeaders(endpoint)
    return watchMovieSchema.parse(json)
  }

  private extractEmbedLinks(data: z.infer<typeof watchMovieSchema>): EmbedLink[] {
    const { quality, qualityVo, qualityVostfr, version, ...links } = data

    return Object.entries(links)
      .map(([key, url]) => {
        if (!url) return null
        return {
          url,
          language: key.match(/vo/i) ? 'VO' : 'VF',
        }
      })
      .filter((link): link is EmbedLink => link !== null)
  }

  async getEmbedLinks(tmdbId: number): Promise<EmbedLink[]> {
    const movieData = await this.getMovieData(tmdbId)
    if ('error' in movieData) throw new Error(`${movieData.error}`)
    return this.extractEmbedLinks(movieData)
  }

  async getMovies(payload?: { page?: number; order?: 'popular' | 'update' | 'latest' }) {
    const schema = z.object({
      page: z.coerce.number().default(1),
      order: z.enum(['popular', 'update', 'latest']).default('popular'),
    })

    const valid = schema.parse(payload || {})

    const url = `${this.API_URL}/movies?order=${valid.order}&limit=200&page=${valid.page}`
    const data = (await this.fetchWithHeaders(url)) as IFrembedPopularMovieResponse

    const movies = await Promise.all(
      data.result.items.map((item) =>
        limit(async () => {
          const tmdbId = Number(item.tmdb)
          if (!tmdbId) return null

          const embedLinks = await this.getEmbedLinks(tmdbId)
          if (embedLinks.length < 1) return null

          return { ...item, embedLinks }
        })
      )
    )

    return movies.filter((movie): movie is NonNullable<typeof movie> => movie !== null)
  }
}

const frembed = new FrembedService()
export default frembed
