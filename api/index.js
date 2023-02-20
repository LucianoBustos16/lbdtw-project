import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json'
import nextmatch from '../db/nextmatch.json'
import schedule from '../db/schedule.json'
import teams from 'db/teams.json'


const app = new Hono()

app.get('/', (ctx) =>
	ctx.json([
		{
			endpoint: '/leaderboard',
			description: 'Returns the leaderboard',
			parameters:[
				{
					name: 'team',
					endpoint: 'leaderboard/:teamId',
					description: 'Return leaderboard info from TeamId'
				}
			]
		},
		{
			endpoint: '/nextmatch',
			description: 'Returns the next match to Belgrano'
		},
		{
			endpoint: '/schedule',
			description: 'Returns the next match to Belgrano',
		},
		{
			endpoint: '/teams',
			description: 'Returns all Kings League teams',
		},
	]))


app.get('/leaderboard' , (ctx) => {
	return ctx.json(leaderboard)
})

app.get('/leaderboard/:teamId', (ctx) => {
	const teamId = ctx.req.param('teamId')
	const foundTeam = leaderboard.find((stats) => stats.team.id === teamId )

	return foundTeam ? ctx.json(foundTeam) : ctx.json({message:'Team not found'}, 404)
})

app.get('/nextmatch' , (ctx) => {
	return ctx.json(nextmatch)
})

app.get('/schedule' , (ctx) => {
	return ctx.json(schedule)
})

app.get('/teams' , (ctx) => {
	return ctx.json(teams)
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