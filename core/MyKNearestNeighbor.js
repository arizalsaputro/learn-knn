/**
 * Created by muharizals on 02/12/2017.
 */

class MyKNearestNeighbor{
    constructor(training = [],validation = []){
        this.training = training
        this.validation = validation
    }

    getRankList(list=[],k=1,newValue={}){
        if(!newValue.hasOwnProperty('total')){
            return list
        }
        if(list.length < k){
            list.push(newValue)
        }else{
            let max = Math.max.apply(Math,list.map((o)=>{return o.total}))
            if(newValue.total < max){
                list.splice(list.findIndex((item)=> max === item.total),1)
                list.push(newValue)
            }
        }

        return list
    }

    getDominantRanking(list=[],classifiedName='something'){
        if(list.length <= 0){
            return '?'
        }
        let resultReduce = list.reduce((allData,item)=>{
            let idx = allData.findIndex(x => x.prop === item[classifiedName])
             idx > -1? allData[idx].count++ :allData.push({prop:item[classifiedName],count:1})
            return allData
        },[])

       return resultReduce.find(item => item.count === Math.max.apply(Math,resultReduce.map(o => o.count))).prop

    }

    calculateAccuracy(raw = [],classifiedName='something',resultName='Result'){
        return (raw.filter(item => item[classifiedName] === item[resultName]).length / raw.length) * 100
    }


    runTesting(k = 1,classifiedName='something',resultName='Result',exceptFieldName=["SomeFieldName"]){
        console.time("knn-time:")
        console.log('running program..')
        let rankList = [],obj,tot,newResult = this.validation.map((validationItem)=>{
            rankList = []
            this.training.forEach((trainingItem)=>{
                tot = 0

                for(obj in validationItem){
                    if(validationItem.hasOwnProperty(obj) && trainingItem.hasOwnProperty(obj)){
                        if(exceptFieldName.includes(obj.toString())){
                            continue
                        }
                        tot = tot + Math.pow(validationItem[obj] - trainingItem[obj],2)
                    }
                }

                tot = Math.sqrt(tot)

                rankList = this.getRankList(rankList,k,{[classifiedName]:trainingItem[classifiedName],total:tot})

            })

            validationItem[resultName] = this.getDominantRanking(rankList,classifiedName)
            return validationItem
        })
        console.timeEnd("knn-time:")
        return {
            k:k,
            accuracy:this.calculateAccuracy(newResult,classifiedName,resultName)
        }
    }
}

module.exports = MyKNearestNeighbor