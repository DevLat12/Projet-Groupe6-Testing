const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');

function generateSSL(ip) {
  const attrs = [{ name: 'commonName', value: ip }];
  const options = {
    days: 365,
    keySize: 2048,
    extensions: [{ name: 'subjectAltName', altNames: [{ type: 7, ip }] }]
  };

  const pems = selfsigned.generate(attrs, options);
  const certPath = path.join(__dirname, '../ssl');
  if (!fs.existsSync(certPath)) fs.mkdirSync(certPath);

  fs.writeFileSync(`${certPath}/cert.pem`, pems.cert);
  fs.writeFileSync(`${certPath}/key.pem`, pems.private);

  return {
    key: pems.private,
    cert: pems.cert
  };
}

module.exports = generateSSL;
