import express from 'express';
import read from './jsonFileStorage.js';

const app = express();

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
