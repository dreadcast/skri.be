import chalk from 'chalk';
import process from 'process';
import prettyjson from 'prettyjson';

const COLOR_LOG = 'gray';
const COLOR_INFO = 'cyan';
const COLOR_WARN = 'yellow';
const COLOR_ERROR = 'red';

var logger = {
	format(color, args){
		if(process.env.NODE_ENV == 'dev'){
			args = Array.prototype.slice.call(args);
			// args = args.map(arg => chalk[color](arg) + '\n');
			args = args.map(arg => {
				if(typeof arg == 'object') {
					return prettyjson.render(arg, {
						stringColor: 'white',
						defaultIndentation: 4,
						inlineArrays: 1,
					});
				}

				return chalk.white(arg) + '\n';
			});

			let type;

			switch (color) {
				case COLOR_INFO:
					type = '\u2139 INFO';
					break;

				case COLOR_WARN:
					type = '\u26A0 WARN';
					break;

				case COLOR_ERROR:
					type = '\u274C ERROR';
					// type = '\u20E0 ERROR';
					break;

				default:
					type = '\u2261 LOG';
					break;
			}
			args.unshift(chalk[color](type) + '\n');

			return console.log.apply(console, args);
		}
	},

	log(){
		return logger.format(COLOR_LOG, arguments);
	},

	info(){
		return logger.format(COLOR_INFO, arguments);
	},

	error(){
		return logger.format(COLOR_ERROR, arguments);
	},

	warn(){
		return logger.format(COLOR_WARN, arguments);
	}
}

export default logger;
