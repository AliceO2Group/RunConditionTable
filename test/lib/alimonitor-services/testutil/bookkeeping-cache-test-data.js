const fs = require('fs');
const path = require('path');
const { Cacher } = require('../../../../app/lib/alimonitor-services/helpers');
const { rctData: { detectors } } = require('../../../../app/lib/../config');

const { randint, choice, universalNoncontextualArrayDataGenerator, randomPeriodName, randomRunNumber, randomBeamType } = require('./common.js');

const dataUnitDefinition = {
    runNumber: randomRunNumber,
    lhcPeriod: randomPeriodName,
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
    pdpBeamType: randomBeamType,
};

const getBkpSourceFiles = (offset, limit) =>
    `filter%5Bdefinitions%5D=PHYSICS&page%5Boffset%5D=${offset}&page%5Blimit%5D=${limit}.json`;

const genRunsBatch = (size, filesN) => {
    const totalCount = size * filesN;
    const pData = [...new Array(filesN)]
        .map((_, pageIndex) => [
            getBkpSourceFiles(pageIndex * size, size),
            {
                data: universalNoncontextualArrayDataGenerator(size, dataUnitDefinition),
                meta: {
                    page: { pageCount: filesN, totalCount },
                },
            },
        ]);
    return pData;
};

const bookkeepingServiceName = 'BookkeepingService';

const generateRandomBookkeepingCachedRawJsons = (size, filesNumber) => genRunsBatch(size, filesNumber)
    .map(([fN, data]) => {
        const cacheDir = Cacher.serviceCacheDir(bookkeepingServiceName);
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const targetPath = path.join(cacheDir, fN);
        fs.writeFileSync(
            targetPath,
            JSON.stringify(data, null, 2),
        );
    });

const cleanCachedBkpData = () => {
    fs.rmSync(Cacher.serviceCacheDir(bookkeepingServiceName), { recursive: true, force: true });
};

module.exports = {
    generateRandomBookkeepingCachedRawJsons,
    cleanCachedBkpData,
};
