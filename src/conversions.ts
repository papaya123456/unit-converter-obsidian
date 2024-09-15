const intOrFloat = '\\d+(\\.\\d+)?';  // Pattern to match integers or floats
const unitSuffix = '\\b'; // Word boundary to end the unit

// List of units and their multipliers
const units = [
    { name: 'mi(les?)?', unit: 'km', multiplier: 1.60934 },
    { name: 'f(ee|oo)?t', unit: 'm', multiplier: 0.3048 },
    { name: 'yards', unit: 'm', multiplier: 0.9144 },
    { name: '(pound|lb)s?', unit: 'kg', multiplier: 0.453592 },
    { name: 'gallons?', unit: 'L', multiplier: 3.78541 },
    { name: 'stones?', unit: 'kg', multiplier: 6.35029 },
    { name: 'inch(es)?', unit: 'cm', multiplier: 2.54 }
];

// Generate regex patterns for each unit
export const unitsCheckForConversion = units.map(unit => ({
    regex: new RegExp('(' + intOrFloat + ' ?' + unit.name + ')' + unitSuffix, 'ig'),
    unit: unit.unit,
    multiplier: unit.multiplier
}));

// ounce, pound