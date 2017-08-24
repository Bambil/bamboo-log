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

/* winston.js */
const winston = require('winston')

winston.remove(winston.transports.Console)
winston.add(winston.transports.File, {
  filename: 'bamboo-log.log',
  colorize: true,
  timestamp: true,
  prettyPrint: true,
  json: false,
  tailable: true,
  maxFiles: 1
})
winston.add(winston.transports.Http, {
  host: config.winstond.host,
  port: config.winstond.port
})

/* Command Line Interface */
const vorpal = require('vorpal')()
const chalk = require('chalk')
const { exec } = require('child_process')

vorpal
  .command('logs', 'system generated logs')
  .action(function (args, callback) {
    exec('cat bamboo-log.log', (error, stdout, stderr) => {
      if (error) {
        callback()
      }
      this.log(stdout)
      callback()
    })
  })

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
vorpal.delimiter(`${chalk.green('Bamboo')} - ${chalk.rgb(255, 177, 79)('Log')} > `).show()

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
    let n = 1

    if ('n' in request.query) {
      n = request.query.n
    }

    for (let s of request.payload['states']) {
      r.push(
        bambooLog.fetch(request.payload['agent_id'], request.payload['thing_id'], s, n)
      )
    }
    return reply(Promise.all(r).then((states) => {
      let res = {}

      for (let i = 0; i < states.length; i++) {
        res[request.payload['states'][i]] = states[i]
      }

      return res
    }))
  }
})

server.start((err) => {
  if (err) {
    throw err
  }
  vorpal.log(` * HTTP at ${server.info.uri}`)
})
