const constants = require('../common/constants');
const featureFunctions = require('../common/featureFunctions.js');

const fs = require('fs');
console.log("Extracting features...");

const samples = JSON.parse(
    fs.readFileSync(constants.SAMPLES)
);

console.log(samples.length);
let i = 0;

for (const sample of samples) {
    i++;
    if((i/samples.length*100).toFixed((0)) != ((i - 1)/samples.length*100).toFixed((0))) {
        console.log((i/samples.length*100).toFixed((0)) + "%");
    }
    const paths = JSON.parse(
        fs.readFileSync(
            constants.JSON_DIR + "/" + sample.id + ".json"
        )
    );

    const functions = featureFunctions.inUse.map(f=>f.function);
    sample.point = functions.map(f=>f(paths));
    
}

const featuresNames = [
    "Path Count",
    "Point Count"
];

fs.writeFileSync(constants.FEATURES,
    JSON.stringify({
        featuresNames,
        samples:samples.map(
            s => {
                return {
                    point:s.point,
                    label:s.label
                }
            }
        )
    })
);

fs.writeFileSync(constants.FEATURES_JS,
    `const features = ${JSON.stringify({featuresNames, samples})};`   
 );

console.log("Done");