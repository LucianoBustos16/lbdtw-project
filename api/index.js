import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leadboard from '../db/leaderboard.json'
import nextmatch from '../db/nextmatch.json'
import schedule from '../db/schedule.json'


const app = new Hono()

app.get('/', (ctx) =>
	ctx.json([
		{
			endpoint: '/leaderboard',
			description: 'Returns the leaderboard'
		},
		{
			endpoint: '/nextmatch',
			description: 'Returns the next match to Belgrano'
		},
		{
			endpoint: '/schedule',
			description: 'Returns the next match to Belgrano'
		}		
	]))


app.get('/leaderboard' , (ctx) => {
	return ctx.json(leadboard)
})

app.get('/nextmatch' , (ctx) => {
	return ctx.json(nextmatch)
})

app.get('/schedule' , (ctx) => {
	return ctx.json(schedule)
})



app.get('/static/*', serveStatic({ root: './'}))

app.notFound((c) => {
	const { pathname } = new URL(c.req.url)

	if (c.req.url.replaceAll(-1) === '/') {
		return c.redirect(pathname.slice(0.-1))
	}

	return c.json({ message: 'Not Found' }, 404)
})


export default app 