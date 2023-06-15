import configureMeasurements, { mass, volume, length } from 'convert-units';

const TEASPOON = "tsp";
const TABLESPOON = "Tbsp"
const CUP = "cup"
const PINT = "pnt"
const QUART = "qt"
const GALLON = "gal"
const FLUID_OUNCE = "fl oz"
const MILLILITER = "ml"
const LITER = "l"
const OUNCE = "oz"
const POUND = "lb"
const GRAM = "g"
const KILOGRAM = "kg"
const INCH = "in"
const FOOT = "ft"
const CENTIMETER = "cm"
const METER = "m"
const UNKNOWN = "UNKNOWN"

const STANDARDIZED_UNIT_MAP = {
    "tsp": TEASPOON,
    "teaspoon": TEASPOON,
    "t": TEASPOON,
    "tbsp": TABLESPOON,
    "tablespoon": TABLESPOON,
    "tbs": TABLESPOON,
    "tb": TABLESPOON,
    "T": TABLESPOON,
    "cup": CUP,
    "c": CUP,
    "pnt": PINT,
    "pint": PINT,
    "pt": PINT,
    "qt": QUART,
    "quart": QUART,
    "gal": GALLON,
    "gallon": GALLON,
    "fl-oz": FLUID_OUNCE,
    "fluid ounce": FLUID_OUNCE,
    "fl oz": FLUID_OUNCE,
    "floz": FLUID_OUNCE,
    "ml": MILLILITER,
    "millilitre": MILLILITER,
    "milliliter": MILLILITER,
    "l": LITER,
    "litre": LITER,
    "liter": LITER,
    "oz": OUNCE,
    "ounce": OUNCE,
    "lb": POUND,
    "pound": POUND,
    "g": GRAM,
    "gram": GRAM,
    "kg": KILOGRAM,
    "kilogram": KILOGRAM,
    "in": INCH,
    "inch": INCH,
    "ft": FOOT,
    "feet": FOOT,
    "cm": CENTIMETER,
    "centimetre": CENTIMETER,
    "centimeter": CENTIMETER,
    "m": METER,
    "metre": METER,
    "meter": METER
}

const UNIT_PRECISION_MAP = {};
UNIT_PRECISION_MAP[TEASPOON] = [1/8]
UNIT_PRECISION_MAP[TABLESPOON] = [1/3, 1/2]
UNIT_PRECISION_MAP[CUP] = [1/8, 1/3]
UNIT_PRECISION_MAP[PINT] = [1/8]
UNIT_PRECISION_MAP[QUART] = [1/8]
UNIT_PRECISION_MAP[GALLON] = [1/16]
UNIT_PRECISION_MAP[FLUID_OUNCE] = [1/4, 1/3]
UNIT_PRECISION_MAP[MILLILITER] = [1.0]
UNIT_PRECISION_MAP[LITER] = [1/10]
UNIT_PRECISION_MAP[OUNCE] = [1/10]
UNIT_PRECISION_MAP[POUND] = [1/16, 1/3]
UNIT_PRECISION_MAP[GRAM] = [1/10]
UNIT_PRECISION_MAP[KILOGRAM] = [1/10]
UNIT_PRECISION_MAP[INCH] = [1/16]
UNIT_PRECISION_MAP[FOOT] = [1/12]
UNIT_PRECISION_MAP[CENTIMETER] = [1/10]
UNIT_PRECISION_MAP[METER] = [1/10]
UNIT_PRECISION_MAP[UNKNOWN] = [1/8, 1/3]

const convert = configureMeasurements({
    volume: {
        systems: {
            imperial: {
                tsp: volume.systems.imperial.tsp,
                Tbsp: volume.systems.imperial.Tbs,
                cup: volume.systems.imperial.cup,
                pnt: volume.systems.imperial.pnt,
                qt: volume.systems.imperial.qt,
                gal: volume.systems.imperial.gal,
            },
            metric: {
                ml: volume.systems.metric.ml,
                l: volume.systems.metric.l,
            },
            fluid_oz: {
                'fl oz': volume.systems.imperial['fl-oz'],
            }
        },
        anchors: volume.anchors
    }, mass: {
        systems: {
            imperial: {
                oz: mass.systems.imperial.oz,
                lb: mass.systems.imperial.lb,
            },
            metric: {
                g: mass.systems.metric.g,
                kg: mass.systems.metric.kg,
            },
        },
    }, length: {
        systems: {
            imperial: {
                in: length.systems.imperial.in,
                ft: length.systems.imperial.ft,
            },
            metric: {
                cm: length.systems.metric.cm,
                m: length.systems.metric.m,
            },
        },
        anchors: mass.anchors
    },
});

const MIN_VAL_PER_UNIT = {
    volume: {
        imperial: [
            {
                unit: TEASPOON,
                minValue: 0
            },
            {
                unit: TABLESPOON,
                minValue: convert(1).from(TABLESPOON).to(TEASPOON)
            },
            {
                unit: CUP,
                minValue: convert(1/4).from(CUP).to(TEASPOON)
            },
            {
                unit: PINT,
                minValue: convert(1).from(PINT).to(TEASPOON)
            },
            {
                unit: QUART,
                minValue: convert(1).from(QUART).to(TEASPOON)
            },
            {
                unit: GALLON,
                minValue: convert(1).from(GALLON).to(TEASPOON)
            }
        ],
        metric: [
            {
                unit: MILLILITER,
                minValue: 0
            },
            {
                unit: LITER,
                minValue: convert(1).from(LITER).to(MILLILITER)
            }
        ],
        fluid_oz: [
            {
                unit: FLUID_OUNCE,
                minValue: 0
            }
        ]
    },
    mass: {
        imperial: [
            {
                unit: OUNCE,
                minValue: 0
            },
            {
                unit: POUND,
                minValue: convert(1).from(POUND).to(OUNCE)
            }
        ],
        metric: [
            {
                unit: GRAM,
                minValue: 0
            },
            {
                unit: KILOGRAM,
                minValue: convert(1).from(KILOGRAM).to(GRAM)
            }
        ]
    },
    length: {
        imperial: [
            {
                unit: INCH,
                minValue: 0
            },
            {
                unit: FOOT,
                minValue: convert(1).from(FOOT).to(INCH)
            }
        ],
        metric: [
            {
                unit: CENTIMETER,
                minValue: 0
            },
            {
                unit: METER,
                minValue: convert(1).from(METER).to(CENTIMETER)
            }
        ]
    }
};

const UNITS = {
    "tsp": "volume",
    "Tbsp": "volume",
    "cup": "volume",
    "pnt": "volume",
    "qt": "volume",
    "gal": "volume",
    "fl oz": "volume",
    "ml": "volume",
    "l": "volume",
    "oz": "mass",
    "lb": "mass",
    "g": "mass",
    "kg": "mass",
    "in": "length",
    "ft": "length",
    "cm": "length",
    "m": "length"
}

const SYSTEMS = {
    "tsp": "imperial",
    "Tbsp": "imperial",
    "cup": "imperial",
    "pnt": "imperial",
    "qt": "imperial",
    "gal": "imperial",
    "fl oz": "imperial",
    "ml": "metric",
    "l": "metric",
    "oz": "imperial",
    "lb": "imperial",
    "g": "metric",
    "kg": "metric",
    "in": "imperial",
    "ft": "imperial",
    "cm": "metric",
    "m": "metric"
}

class RationalValue {
    constructor(whole_or_quantity, numerator, denominator) {
        this.whole = whole_or_quantity
        this.numerator = numerator;
        this.denominator = denominator;
    }

    toString() {
        if (this.numerator === null || this.numerator === undefined || this.numerator === 0) {
            return `${this.whole}`;
        } else if (this.whole === 0) {
            return `${this.numerator}/${this.denominator}`
        }
        return `${this.whole} ${this.numerator}/${this.denominator}`;
    }
}

function rationalizeDecimal(quantity, unit) {
    let bestPrecision = findBestPrecision(quantity, unit);
    let decimalPart = quantity % 1;
    let denominator = Math.round(1 / bestPrecision);
    let numerator = Math.round(decimalPart * denominator);
    // Max divisor is 16 so let's simplify with a very basic algorithm
    for (let i = 16; i > 1; i--) {
        if (numerator % i == 0 && denominator % i == 0) {
            numerator = numerator / i;
            denominator = denominator / i;
            break;
        }
    }

    return [Math.floor(quantity), numerator, denominator]
}

function getBestUnit(quantity, unit) {
    let items = MIN_VAL_PER_UNIT[UNITS[unit]][SYSTEMS[unit]];
    let normalizedQuantity = convert(quantity).from(unit).to(items[0]["unit"]);

    for (let i = 0; i < items.length - 1; i++) {
        if (normalizedQuantity < items[i + 1]["minValue"]) {
            return items[i]["unit"]
        }
    }

    return items[items.length - 1]["unit"]
}

function sanitizeUnit(unit) {
    let newUnit = unit.replace(".", "");

    if (unit.length > 1) {
        newUnit = unit.toLowerCase();
    }

    if (unit.endsWith("s")) {
        newUnit = unit.substring(0, unit.length - 1);
    }

    if (STANDARDIZED_UNIT_MAP[newUnit]) {
        return STANDARDIZED_UNIT_MAP[newUnit];
    } else {
        return null;
    }
}

function convertQuantity(quantity, oldServings, newServings) {
    return quantity * (newServings / oldServings);
}

function findBestPrecision(quantity, unit) {
    let precisions = UNIT_PRECISION_MAP[unit] || UNIT_PRECISION_MAP[UNKNOWN];
    let fractionalComponent = quantity % 1;

    let smallestDistance = null;
    let bestPrecision = null;
    for (let precision of precisions) {
        if (Math.abs(fractionalComponent - precision) < .001) {
            bestPrecision = precision;
            break;
        }

        let distance = fractionalComponent % precision;
        if (smallestDistance === null || distance < smallestDistance) {
            smallestDistance = distance;
            bestPrecision = precision;
        }
    }
    return bestPrecision;
}

function roundByDecimal(quantity, decimalToRoundTo) {
    let inv = 1.0 / decimalToRoundTo;
    return Math.round(quantity * inv) / inv;
}

function normalizeQuantityUnits(quantity, unit, oldServings, newServings, ignoreUnits) {
    let newQuantity = convertQuantity(quantity, oldServings, newServings);
    let sanitizedUnit = sanitizeUnit(unit);
    let newUnit;

    if (sanitizedUnit === null || ignoreUnits) {
        newUnit = unit;
    } else {
        newUnit = getBestUnit(newQuantity, sanitizedUnit);
        newQuantity = convert(newQuantity).from(sanitizedUnit).to(newUnit);
    }

    let quantityPrecision = findBestPrecision(newQuantity, newUnit);
    if (newUnit === "tsp" && newQuantity < 0.125) {
        quantityPrecision = 0.0625;
    }
    newQuantity = roundByDecimal(newQuantity, quantityPrecision);
    let [whole, numerator, denominator] = rationalizeDecimal(newQuantity, newUnit);

    return {quantity: newQuantity, unit: newUnit, rational: new RationalValue(whole, numerator, denominator)};
}

export default normalizeQuantityUnits;
export { RationalValue, rationalizeDecimal };