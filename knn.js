/**
 * k yang digunakan adalah 1 / 2 ,sesuai dengan testing/training
 * Created by muharizals on 02/12/2017.
 */
const csv = require('fast-csv')
const MyKNearestNeighbor = require('./core/KnnRecursion')

const trainingPath = './datas/TrainingSet.csv'
const testPath = './datas/DataTest.csv'
const outputPath = './output/Results.csv'

let rawDataTraining = [],rawValidationData = [];
console.time("knn-time:")
console.log(`read training data ${trainingPath}`)


csv
    .fromPath(trainingPath,{headers:true,delimiter:';'})
    .on('data',(data)=>{
        rawDataTraining.push(data)
    })
    .on('end',()=>{
        console.log(`done read training data ${trainingPath}`)
        readTestData()
    })

const readTestData = ()=>{
    console.log(`read test data ${testPath}`)
    csv
        .fromPath(testPath,{headers:true,delimiter:';'})
        .on('data',(data)=>{
            rawValidationData.push(data)
        })
        .on('end',()=>{
            console.log(`done read test data ${testPath}`)
            Run();
        })
};


const Run = ()=>{
    console.log('running knn algorithm..')

    const myKnn = new MyKNearestNeighbor(rawDataTraining,rawValidationData);

    let result = myKnn.run(1,'Hoax','Result',['Berita','Hoax'])

    console.log('done running knn algorithm')
    console.log(`write result data to ${outputPath}`)
    csv
        .writeToPath(outputPath,result.data,{headers:true,delimiter:';'})
        .on('finish',()=>{
            console.timeEnd("knn-time:")
            console.log(`done saving result test to ${outputPath}`)
        })

}