const LxCommunicator = require('lxcommunicator');

const connection = new LxCommunicator();
connection.setCredentials('admin', 'Modo@2023');
connection.connect('dns.loxonecloud.com/504F94D04BEF')
    .then(() => {
        console.log('Connected to Loxone Miniserver');
    })
    .catch((err) => {
        console.error('Connection error:', err);
    });
