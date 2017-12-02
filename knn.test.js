/**
 * dari hasil test k-n yang menghasilkan akurasi 100% adalah 1 dan 2
 *
 * Created by muharizals on 02/12/2017.
 */

const csv = require('fast-csv')
const path = './datas/TrainingSet.csv'
const MyKNearestNeighbor = require('./core/KnnRecursion')

let rawDataTraining = [],rawValidationData = [], validationLength = 1000

console.log(`read data ${path}`)
console.time('time-read:')

csv
    .fromPath(path,{headers:true,delimiter:';'})
    .on('data',(data)=>{
        rawDataTraining.push(data)
    })
    .on('end',()=>{
        console.log(`done read data ${path}`)
        console.time('time-read:')
        rawValidationData = rawDataTraining.slice(rawDataTraining.length-validationLength-1,rawDataTraining.length)
        Run();
    })


const Run = ()=>{
    console.time("knn-time:")
    console.log('running knn algorithm..')

     let listKResult = [],myKnn = new MyKNearestNeighbor(rawDataTraining,rawValidationData);

    for(let i=1;i<=5;i++){
        let result = myKnn.runTesting(i,'Hoax','Result',['Berita','Hoax'])
        listKResult.push({k:result.k,accuracy:result.accuracy})

        csv
            .writeToPath(`./output/Testing${i}.csv`,result.data,{headers:true,delimiter:';'})
            .on('finish',()=>{

            })
    }
    console.log(`testing result`,listKResult)

    console.timeEnd("knn-time:")
}
