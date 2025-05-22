const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      const isIPv4 = iface.family === 'IPv4';
      const isInternal = iface.internal === false;

      if (isIPv4 && isInternal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // Fallback
}

module.exports = getLocalIPAddress;