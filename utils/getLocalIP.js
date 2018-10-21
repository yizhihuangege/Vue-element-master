let os = require('os');

let ifaces = os.networkInterfaces();

const getIPTable = () => {
    let iptable = [];
    for (var dev in ifaces) {
        ifaces[dev].forEach(function (details, alias) {
            if (details.family == 'IPv4') {
                const item = {
                    name: dev + (alias ? ':' + alias : ''),
                    ip: details.address
                }
                iptable.push(item)
            }
        });
    }
    return iptable
}

const getSingleIP = ()=>{
    const iptable = getIPTable();
    return iptable[0].ip;
}

module.exports = {
    getIPTable,
    getSingleIP
}