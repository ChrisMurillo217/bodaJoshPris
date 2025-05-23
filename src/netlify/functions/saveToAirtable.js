const Airtable = require('airtable');

exports.handler = async (event) => {
  // Configura Airtable con tu API key (usa variables de entorno)
  const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base('appECycBzowt85U19');

  try {
    const data = JSON.parse(event.body);
    const record = await base('Asistencia').create(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ id: record.id })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
