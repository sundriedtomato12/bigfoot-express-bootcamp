import express from 'express';
import { read, add } from './jsonFileStorage.js';

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.get('/', (request, response) => {
  read('data.json', (err, data) => {
    const content = data.sightings;
    response.render('getsightings', { content });
  });
});

app.get('/new', (request, response) => {
  response.render('newsightings');
});

app.post('/new', (request, response) => {
  add('data.json', 'sightings', request.body, (err) => {
    if (err) {
      response.status(500).send('DB write error.');
    }
  });
  let index = '';
  read('data.json', (err, data) => {
    index = data.sightings.length - 1;
    // redirect to sightings site
    response.redirect(`/sightings/${index}`);
  });
});

const getSightings = (request, response) => {
  console.log('request for sightings came in');
  read('data.json', (err, data) => {
    let sightingDetails = '';
    Object.entries(data.sightings[request.params.index]).forEach(([key, value]) => {
      sightingDetails += `${key}: ${value}<br>`;
    });
    const content = `
      <html>
        <body>
          <h1>BIGFOOT SIGHTING DETAILS</h1>
          <h3>${sightingDetails}</h3>
          <h2><a href="/">index page</a></h2>
        </body>
      </html>
    `;
    // respond with data at index specified
    response.send(content);
  });
};

const getSightingsByYear = (request, response) => {
  console.log('request for sightings by year');
  read('data.json', (err, data) => {
    let sightingDetails = '';
    const findYear = () => {
      data.sightings.forEach((element) => {
        if (request.params.year === element.YEAR) {
          sightingDetails += `<p>Year: ${element.YEAR}<br>
          State: ${element.STATE}</p>`;
        }
      });
      return sightingDetails;
    };
    const content = `
    <html>
      <body>
        <h1>BIGFOOT SIGHTINGS IN ${request.params.year}</h1>
        <p>${findYear()};
      </body>
    </html>
    `;
    // respond with data
    response.send(content);
  });
};

app.get('/sightings/:index', getSightings);
app.get('/year-sightings/:year', getSightingsByYear);

app.listen(3004);
