/*
 * +===============================================
 * | Author:        Parham Alvani (parham.alvani@gmail.com)
 * |
 * | Creation Date: 20-07-2017
 * |
 * | File Name:     index.js
 * +===============================================
 */

/* winston.js */
const winston = require('winston')

/* Configure CLI output on the default logger */
winston.cli()
winston.info(' * 18.20 at Sep 07 2016 7:20 IR721')

/* I1820 component initiation */
const I1820Component = require('./src/component')
new I1820Component({
  host: '127.0.0.1',
  port: 1883,
  name: 'log'
}).on('ready', () => {
})
