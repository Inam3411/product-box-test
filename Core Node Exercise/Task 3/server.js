const http = require('http');
const url = require('url');

const getTitle = (address) => {
  return new Promise((resolve, reject) => {

    address = address.replace(/^https?:\/\//,'');
    http.get(`http://${address}`, (response) => {
      let body = '';

      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        const title = body.match(/<title>(.*?)<\/title>/i);
        resolve({
          address: address,
          title: title ? title[1] : 'NO RESPONSE',
        });
      });
    }).on('error', (e) => {
      resolve({
        address: address,
        title: 'NO RESPONSE',
      });
    });
  });
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === '/I/want/title' && parsedUrl.query.address) {
    const addresses = Array.isArray(parsedUrl.query.address)
      ? parsedUrl.query.address
      : [parsedUrl.query.address];

    const results = await Promise.all(addresses.map(getTitle));

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html><head></head><body>');
    res.write('<h1>Following are the titles of given websites:</h1>');
    res.write('<ul>');
    results.forEach((item) => {
      res.write(`<li>${item.address} - "${item.title}"</li>`);
    });
    res.write('</ul></body></html>');
    res.end();
  } else {
    res.writeHead(404);
    res.write('<h1>Page not found. Please enter valid URL.</h1>');
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
