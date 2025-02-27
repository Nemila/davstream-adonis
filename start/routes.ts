const FrembedsController = () => import('#controllers/scrapers/frembeds_controller')
const MediaController = () => import('#controllers/media_controller')
const EpisodesController = () => import('#controllers/episodes_controller')
const PlayersController = () => import('#controllers/players_controller')
const SeasonsController = () => import('#controllers/seasons_controller')
import router from '@adonisjs/core/services/router'

// Api routes
router
  .group(() => {
    router
      .group(() => {
        router.get('/popular', [MediaController, 'getPopular'])
        router.get('/trending', [MediaController, 'getTrending'])

        router
          .get('/details/:id', [MediaController, 'getMediaDetails'])
          .where('id', router.matchers.number())

        router
          .get('/:id/recommendations', [MediaController, 'getRecommendations'])
          .where('id', router.matchers.number())

        router
          .get('/:id/similars', [MediaController, 'getSimilars'])
          .where('id', router.matchers.number())

        router.get('/search', [MediaController, 'searchMedia'])
      })
      .prefix('media')

    router
      .group(() => {
        router
          .get('/:mediaId', [SeasonsController, 'getMediaSeasons'])
          .where('mediaId', router.matchers.number())

        router
          .get('/:mediaId/:seasonNumber', [SeasonsController, 'getSeasonDetails'])
          .where('mediaId', router.matchers.number())
          .where('seasonNumber', router.matchers.number())
      })
      .prefix('seasons')

    router
      .group(() => {
        router.get('/:mediaId/:seasonNumber', [EpisodesController, 'getSeasonEpisodes'])
        router.get('/:mediaId/:seasonNumber/:episodeNumber', [
          EpisodesController,
          'getEpisodeDetails',
        ])
      })
      .prefix('episodes')

    router
      .group(() => {
        router.get('/extract', [PlayersController, 'getDirectLinks'])
        router
          .get('/:episodeId', [PlayersController, 'getPlayers'])
          .where('episodeId', router.matchers.number())
      })
      .prefix('players')
  })
  .prefix('api')

// Scrapers' routes
router
  .group(() => {
    router
      .group(() => {
        router.get('/movies', [FrembedsController, 'scrapeMovies'])
      })
      .prefix('frembed')
  })
  .prefix('scraper')
