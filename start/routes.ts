const FrembedsController = () => import('#controllers/scrapers/frembeds_controller')
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router
      .group(() => {
        router.get('/movies/popular', [FrembedsController, 'scrapePopularMovies'])
        router.get('/movies/latest', [FrembedsController, 'scrapeLatestMovies'])
      })
      .prefix('frembed')
  })
  .prefix('scraper')
