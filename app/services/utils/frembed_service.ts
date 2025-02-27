import { z } from 'zod'

const watchMovieSchema = z.object({
  link1: z.string().nullable(),
  link2: z.string().nullable(),
  link3: z.string().nullable(),
  link4: z.string().nullable(),
  link5: z.string().nullable(),
  link6: z.string().nullable(),
  link7: z.string().nullable(),
  link1vostfr: z.string().nullable(),
  link2vostfr: z.string().nullable(),
  link3vostfr: z.string().nullable(),
  link4vostfr: z.string().nullable(),
  link5vostfr: z.string().nullable(),
  link6vostfr: z.string().nullable(),
  link7vostfr: z.string().nullable(),
  link1vo: z.string().nullable(),
  link2vo: z.string().nullable(),
  link3vo: z.string().nullable(),
  link4vo: z.string().nullable(),
  link5vo: z.string().nullable(),
  link6vo: z.string().nullable(),
  link7vo: z.string().nullable(),
  version: z.string().nullable(),
  quality: z.string().nullable(),
  qualityVostfr: z.string().nullable(),
  qualityVo: z.string().nullable(),
})

// interface MovieOptions {
//   order: 'latest' | 'popular' | 'update' | 'year'
//   limit: number
//   page: number
// }

interface EmbedLink {
  url: string
  language: 'VO' | 'VF'
}

class FrembedService {
  private readonly API_URL = 'https://api.frembed.live'
  private readonly BASE_URL = 'https://frembed.live/api'

  private readonly HEADERS = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept':
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://frembed.live',
  }

  private async fetchWithHeaders(url: string) {
    const response = await fetch(url, { headers: this.HEADERS })
    return response.json()
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

  async getMovies(page: number) {
    const url = `${this.API_URL}/movies?order=popular&limit=25&page=${page}`
    const data = (await this.fetchWithHeaders(url)) as IFrembedPopularMovieResponse

    const movies = await Promise.all(
      data.result.items.map(async (item) => {
        const tmdbId = Number(item.tmdb)
        if (!tmdbId) return null

        const embedLinks = await this.getEmbedLinks(tmdbId)
        if (embedLinks.length < 1) return null

        return { ...item, embedLinks }
      })
    )

    return movies.filter((movie): movie is NonNullable<typeof movie> => movie !== null)
  }
}

const frembed = new FrembedService()
export default frembed
