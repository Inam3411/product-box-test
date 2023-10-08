const http = require('http');
const async = require('async');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === '/I/want/title' && parsedUrl.query.address) {
    const addresses = Array.isArray(parsedUrl.query.address)
      ? parsedUrl.query.address
      : [parsedUrl.query.address];

    const fetchTitle = (address, callback) => {
      address = address.replace(/^https?:\/\//,'');
      http.get(`http://${address}`, (response) => {
        let body = '';

        response.on('data', (chunk) => {
          body += chunk;
        });

        response.on('end', () => {
          const title = body.match(/<title>(.*?)<\/title>/i);
          callback(null, {
            address: address,
            title: title ? title[1] : 'NO RESPONSE',
          });
        });
      }).on('error', (e) => {
        callback(null, {
          address: address,
          title: 'NO RESPONSE',
        });
      });
    };

    async.mapLimit(addresses,5, fetchTitle, (err, results) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<html><head></head><body>');
      res.write('<h1>Following are the titles of given websites:</h1>');
      res.write('<ul>');
      results.forEach((item) => {
        res.write(`<li>${item.address} - "${item.title}"</li>`);
      });
      res.write('</ul></body></html>');
      res.end();
    });
} else {
    res.writeHead(404);
    res.write('<h1>Page not found. Please enter valid URL.</h1>');
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
