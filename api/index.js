import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboardLPF from '../db/leaderboardLPF.json'
import nextmatch from '../db/nextmatch.json'
import schedule from '../db/schedule.json'
import matchstoday from '../db/matchstoday.json'
import teams from 'db/teams.json'
import leagues from '../db/leagues.json'


const app = new Hono()

app.get('/', (ctx) =>
	ctx.json([
		{
			endpoint: '/leaderboardLPF',
			description: 'Returns the leaderboardLPF',
			parameters:[
				{
					name: 'team',
					endpoint: 'leaderboardLPF/:teamId',
					description: 'Return leaderboardLPF info from TeamId'
				}
			]
		},
		{
			endpoint: '/nextmatch',
			description: 'Returns the next match to Belgrano'
		},
		{
			endpoint: '/schedule',
			description: 'Returns the fixture',
		},
		{
			endpoint: '/teams',
			description: 'Returns all LPF  teams',
		},
		{
			endpoint: '/leagues',
			description: 'Returns all leagues',
		},
		{
			endpoint: '/matchstoday',
			description: 'Returns match today',
		},
	]))


app.get('/leaderboardLPF' , (ctx) => {
	return ctx.json(leaderboardLPF)
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
app.get('/leagues' , (ctx) => {
	return ctx.json(leagues)
})
app.get('/matchstoday' , (ctx) => {
	return ctx.json(matchstoday)
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