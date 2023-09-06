const fs = require('fs');
const path = require('path');
const { Cacher } = require('../../../../app/lib/alimonitor-services/helpers');
const { rctData: { detectors } } = require('../../../../app/lib/config/configProvider.js');

const randint = (min = 0, max = 0) => Math.round(Math.random() * (max - min) + min);
const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];

const ketpFields = {
    runNumber: () => randint(1000000, 9000000),
    lhcPeriod: () => `LHC${choice([22, 18])}${choice('abceadbfarebivaavgauvgzxvcm')}`,
    timeO2Start: () => randint(100000000, 200000000),
    timeO2End: () => randint(100000000, 200000000),
    timeTrgStart: () => randint(200000000, 300000000),
    timeTrgEnd: () => randint(200000000, 300000000),
    definition: () => 'PHYSICS',
    lhcBeamEnergy: () => randint(1000, 10000),
    detectorsQualities: () => detectors.map((d) => ({ name: d, quality: choice(['good', 'bad', null]) })),
    aliceL3Current: () => randint(10000, 20000),
    aliceL3Polarity: () => choice(['POSITIVE', 'NEGATIVE']),
    aliceDipoleCurrent: () => randint(10000, 20000),
    aliceDipolePolarity: () => choice(['POSITIVE', 'NEGATIVE']),
    fillNumber: () => randint(5000, 9000),
    pdpBeamType: () => choice(['pp', 'PbPb', 'pPb']),
};

const genSingleRunData = () => Object.fromEntries(
    Object.entries(ketpFields)
        .map(([runField, fieldDataGenerator]) => [runField, fieldDataGenerator()]),
);

const genRunsBatch = (size, files) => {
    const filesN = files.length;
    const totalCount = size * filesN;
    const pData = [...new Array(filesN)]
        .map((_, pageIndex) => [
            files[pageIndex],
            {
                data: [...new Array(size)]
                    .map(() => genSingleRunData()),
                meta: {
                    page: { pageCount: filesN, totalCount },
                },
            },
        ]);
    return pData;
};

const bkpSourceFiles = [
    'filter%5Bdefinitions%5D=PHYSICS&page%5Boffset%5D=0&page%5Blimit%5D=100.json',
    'filter%5Bdefinitions%5D=PHYSICS&page%5Boffset%5D=100&page%5Blimit%5D=100.json',
];

const generateRandomBookkeepingCachedRawJsons = () => genRunsBatch(100, bkpSourceFiles)
    .map(([fN, data]) => {
        const cacheDir = Cacher.serviceCacheDir('BookkeepingService');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const targetPath = path.join(cacheDir, fN);
        fs.writeFileSync(
            targetPath,
            JSON.stringify(data, null, 2),
        );
    });

module.exports = {
    generateRandomBookkeepingCachedRawJsons,
};
