/*
 * +===============================================
 * | Author:        Parham Alvani (parham.alvani@gmail.com)
 * |
 * | Creation Date: 20-07-2017
 * |
 * | File Name:     index.js
 * +===============================================
 */
/* Configuration */
const config = require('config')

/* Command Line Interface */
const vorpal = require('vorpal')()
const chalk = require('chalk')

vorpal
  .command('fetch [state] [agent_id] [thing_id]', 'fetch last data from influx')
  .action(function (args) {
    return bambooLog.fetch(args['agent_id'], args['thing_id'], args['state']).then((states) => {
      if (states.length > 0) {
        this.log(`* value: ${chalk.rgb(123, 192, 67)(states[0].value)}`)
        this.log(`* value: ${chalk.rgb(3, 146, 207)(states[0].time.toString())}`)
      }
    })
  })

vorpal.log(' * 18.20 at Sep 07 2016 7:20 IR721')
vorpal.delimiter(`${chalk.green('Bamboo')} - ${chalk.rgb(255, 177, 79)('Connectivity')} > `).show()

/* Bamboo Log Initiation */
const BambooLog = require('./src/log')

const bambooLog = new BambooLog({
  database: config.database.name,
  host: config.database.host
})

/* Bamboo component initiation */
const BambooComponent = require('@ibamboo/component')

new BambooComponent({
  mqttHost: config.connectivity.host,
  mqttPort: config.connectivity.port,
  name: 'log',
  subscribes: ['log']
}).on('ready', () => {
  vorpal.log(` * MQTT at ${config.connectivity.host}:${config.connectivity.port}`)
}).on('log', (message) => {
  vorpal.log(message)
  bambooLog.log(`${message.tenant}/${message.name}`, message.data.id, message.data.timestamp, message.data.state)
})

/* HTTP server initiation */
const Hapi = require('hapi')

const server = new Hapi.Server()

server.connection({
  host: config.http.host,
  port: config.http.port
})

server.route({
  method: 'POST',
  path: '/thing',
  config: {
    payload: {
      parse: true
    }
  },
  handler: function (request, reply) {
    let r = []

    for (let s of request.payload['states']) {
      r.push(
        bambooLog.fetch(request.payload['agent_id'], request.payload['thing_id'], s)
      )
    }
    return reply(Promise.all(r).then((states) => {
      let res = {}

      for (let i = 0; i < states.length; i++) {
        res[request.payload['states'][i]] = states[i]
      }

      return JSON.stringify(res)
    }))
  }
})

server.start((err) => {
  if (err) {
    throw err
  }
  vorpal.log(` * HTTP at ${server.info.uri}`)
})
