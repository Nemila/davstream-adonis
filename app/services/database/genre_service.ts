import db from '#config/db'
import { Prisma } from '@prisma/client'

class GenreService {
  upsert = async (insertData: Prisma.GenreCreateInput) => {
    return await db.genre.upsert({
      where: { slug: insertData.slug },
      create: insertData,
      update: insertData,
    })
  }

  delete = async (id: number) => {
    return await db.genre.delete({ where: { id } })
  }

  getMedia = async (slug: string) => {
    return await db.genre.findMany({
      select: { media: true, mediaCount: true },
      where: { slug },
    })
  }
}

const genreService = new GenreService()
export default genreService
