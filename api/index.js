import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leadboard from '../db/leaderboard.json'

const app = new Hono()

app.get('/', (ctx) => ctx.json([
		{
			endpoint: '/leaderboard',
			description: 'Returns the leaderboard'
		}

	]))

app.get('/leaderboard' , (ctx) => {
	return ctx.json(leadboard)
})

app.get('/static/*', serveStatic({ root: './'}))

export default app 