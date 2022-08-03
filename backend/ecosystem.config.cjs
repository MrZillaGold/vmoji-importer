const { scripts } = require('./package.json');

const script = './build/index.js';

module.exports = {
    apps : [{
        name: 'vmoji-import-backend',
        watch: false,
        node_args: scripts['start:prod']
            .replace('node ', '')
            .replace(` ${script}`, ''),
        script
    }]
};
