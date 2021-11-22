/**
 * This object defines metadata required to proceed posting data
 * currently at which columns there will not be input and what is target table in backend side
 */
const postingDataConfig = {
    flags: {
        excludedFields: ['id'],
        targetTable: 'flags',
    }
}


export default postingDataConfig;