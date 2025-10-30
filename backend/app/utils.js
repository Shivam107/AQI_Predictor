const fs = require('fs');
const path = require('path');
const csvParse = require('csv-parse/sync');

function loadCityDayCsv() {
  const csvPath = path.join(__dirname, 'city_day.csv');
  if (!fs.existsSync(csvPath)) {
    // If the file does not exist, return empty array or dummy data
    return [];
  }
  const csv = fs.readFileSync(csvPath, 'utf8');
  const records = csvParse.parse(csv, { columns: true });
  // For compatibility with python: extract Month as number
  records.forEach(r => {
    if (r.Date && typeof r.Date === 'string') {
      r.Month = parseInt(r.Date.split('-')[1]);
    }
    if ('AQI_Bucket' in r) delete r.AQI_Bucket;
    r.AQI = r.AQI ? parseFloat(r.AQI) : null;
  });
  return records;
}

function mergeSensorWithHistory(liveData) {
  const hist = loadCityDayCsv();
  // Convert SensorData (classes) to plain object
  const live = liveData.map(d => ({ ...d }));
  return hist.concat(live);
}

const aqiThresholds = [
  { range: [0, 50], category: 'Good', warnings: ['No immediate action required.'], actions: ['Enjoy outdoor activities.'] },
  { range: [51, 80], category: 'Moderate', warnings: ['Air quality is acceptable.'], actions: ['Sensitive groups should consider reducing prolonged exertion.'] },
  { range: [81, 120], category: 'Unhealthy for Sensitive Groups', warnings: ['Wear masks outdoors.'], actions: ['Install air purifiers indoors.'] },
  { range: [121, 150], category: 'Unhealthy', warnings: ['Wear N95 masks.'], actions: ['Avoid outdoor activities.', 'Use air purifiers.'] },
  { range: [151, 200], category: 'Very Unhealthy', warnings: ['Health alert: Everyone may experience effects.'], actions: ['Close windows.', 'Run air purifiers at max.'] },
  { range: [201, 300], category: 'Hazardous', warnings: ['Emergency conditions.'], actions: ['Stay indoors.', 'Use oxygen masks if necessary.'] },
  { range: [301, 500], category: 'Severe', warnings: ['Evacuate if possible.'], actions: ['Seek medical help for breathing issues.'] }
];

function getMitigationMeasures(aqi) {
  for (const th of aqiThresholds) {
    if (aqi >= th.range[0] && aqi <= th.range[1]) {
      return {
        AQI: aqi,
        Category: th.category,
        Warnings: th.warnings,
        Actions: th.actions
      };
    }
  }
  return {
    AQI: aqi,
    Category: 'Unhealthy',
    Warnings: ['Wear N95 masks'],
    Actions: ['Seek medical help for breathing issues']
  };
}

function predictAqiForMonth(month) {
  const hist = loadCityDayCsv();
  const filtered = hist.filter(r => r.Month === month && r.AQI != null);
  if (!filtered.length) return null;
  const avg = filtered.reduce((sum, r) => sum + r.AQI, 0) / filtered.length;
  return Math.round(avg * 100) / 100;
}

module.exports = {
  loadCityDayCsv,
  mergeSensorWithHistory,
  getMitigationMeasures,
  predictAqiForMonth
};
