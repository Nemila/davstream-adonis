import db from '#config/db'
import { Prisma } from '@prisma/client'

class SeasonService {
  upsert = async (insertData: Prisma.SeasonCreateInput) => {
    return await db.season.upsert({
      create: insertData,
      update: insertData,
      where: {
        mediaTmdbId_number: { mediaTmdbId: insertData.mediaTmdbId, number: insertData.number },
      },
    })
  }

  getDetails = async ({ mediaId, seasonNumber }: { mediaId: number; seasonNumber: number }) => {
    return await db.season.findUnique({
      where: {
        mediaId_number: { mediaId: mediaId, number: seasonNumber },
      },
      include: { episodes: true },
    })
  }

  getMediaSeasons = async (mediaId: number) => {
    return await db.season.findMany({
      where: { mediaId },
      orderBy: { number: 'asc' },
      include: { episodes: true },
    })
  }

  delete = async ({ mediaTmdbId, number }: { mediaTmdbId: number; number: number }) => {
    return await db.season.delete({
      where: { mediaTmdbId_number: { mediaTmdbId, number } },
    })
  }
}

const seasonService = new SeasonService()
export default seasonService
