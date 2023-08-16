import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import LPF from '../db/LPF.json'
import LaLiga from '../db/LaLiga.json'
import nextmatch from '../db/nextmatch.json'
import scheduleLPF from '../db/scheduleLPF.json'
import scheduleLaLiga from '../db/scheduleLaLiga.json'
import matchstoday from '../db/matchstoday.json'
import teams from 'db/teams.json'
import leagues from '../db/leagues.json'


const app = new Hono()

app.get('/', (ctx) =>
	ctx.json([
		{
			endpoint: '/LPF',
			description: 'Returns the leaderboardLPF',
			parameters:[
				{
					name: 'team',
					endpoint: 'LPF/:teamId',
					description: 'Return leaderboardLPF info from TeamId'
				}
			]
		},
		{
			endpoint: '/LaLiga',
			description: 'Returns the leaderboardLPF',
			parameters:[
				{
					name: 'team',
					endpoint: 'LaLiga/:teamId',
					description: 'Return leaderboardLPF info from TeamId'
				}
			]
		},
		{
			endpoint: '/nextmatch',
			description: 'Returns the next match to Belgrano'
		},
		{
			endpoint: '/scheduleLPF',
			description: 'Returns the fixture',
		},
		{
			endpoint: '/scheduleLaLiga',
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


app.get('/LPF' , (ctx) => {
	return ctx.json(LPF)
})

app.get('/LPF/:teamId', (ctx) => {
	const teamId = ctx.req.param('teamId')
	const foundTeam = leaderboardLPF.find((stats) => stats.team.id === teamId )

	return foundTeam ? ctx.json(foundTeam) : ctx.json({message:'Team not found'}, 404)
})

app.get('/LaLiga' , (ctx) => {
	return ctx.json(LaLiga)
})

app.get('/LaLiga/:teamId', (ctx) => {
	const teamId = ctx.req.param('teamId')
	const foundTeam = LaLiga.find((stats) => stats.team.id === teamId )

	return foundTeam ? ctx.json(foundTeam) : ctx.json({message:'Team not found'}, 404)
})

app.get('/nextmatch' , (ctx) => {
	return ctx.json(nextmatch)
})

app.get('/scheduleLPF' , (ctx) => {
	return ctx.json(scheduleLPF)
})

app.get('/scheduleLaLiga' , (ctx) => {
	return ctx.json(scheduleLaLiga)
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