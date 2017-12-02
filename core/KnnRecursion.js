/**
 * Created by muharizals on 02/12/2017.
 */

class KnnRecursion{
    constructor(training,validation ){
        this.training = training
        this.validation = validation
    }


    swaptoMinimumValue(list,index,newValue){
        if(index === list.length){
            return list
        }

        if(newValue.total <= list[index].total){
            delete list[index]
            list[index] = newValue
            return list
        }

        index++
        return this.swaptoMinimumValue(list,index,newValue)
    }

    getRankOfList(list,k,newValue){
        if(list.length < k){
            list.push(newValue)
        }else{
           list = this.swaptoMinimumValue(list,0,newValue)
        }
        return list
    }

    getDominantRanking(list,classifiedName){
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

    /**
     * ini kodingan tida digunanakan alias cadangan untuk data static,btw pake fungsi ini lebih lama 3 detik
     * @param index
     * @param list
     * @param validationItem
     * @param trainingItem
     * @param exceptFieldName
     * @param total
     * @returns {*}
     */
    getTotalRecurtion(index,list,validationItem,trainingItem,exceptFieldName,total){
        if(index === list.length){
            return Math.sqrt(total)
        }
        if(!exceptFieldName.includes(list[index]) && validationItem.hasOwnProperty(list[index]) && trainingItem.hasOwnProperty(list[index])){
          total += Math.pow(validationItem[list[index]] - trainingItem[list[index]],2)
        }
        index++
        return this.getTotalRecurtion(index,list,validationItem,trainingItem,exceptFieldName,total)

    }

    getTotal(validationItem,trainingItem,exceptFieldName){
        return Math.sqrt(Math.pow(validationItem["Like"]-trainingItem["Like"],2) + Math.pow(validationItem["Provokasi"]-trainingItem["Provokasi"],2) + Math.pow(validationItem["Komentar"]-trainingItem["Komentar"],2) + Math.pow(validationItem["Emosi"]-trainingItem["Emosi"],2))

    }

    processTwo(k ,classifiedName,resultName,exceptFieldName,index,list,ranking,validationItem,keyList){
        if(index === list.length){
            validationItem[resultName] =  this.getDominantRanking(ranking,classifiedName)
            return validationItem
        }

        ranking = this.getRankOfList(ranking,k,{[classifiedName]:list[index][classifiedName],total:this.getTotal(validationItem,list[index],exceptFieldName)})
        index++
        return this.processTwo(k,classifiedName,resultName,exceptFieldName,index,list,ranking,validationItem,keyList);
    }

    processOne(k,classifiedName,resultName,exceptFieldName,index,list ,training,keyList){
        if(index === list.length){
            return list
        }
        list[index] = this.processTwo(k,classifiedName,resultName,exceptFieldName,0,training,[],list[index],keyList)
        index++
        return this.processOne(k,classifiedName,resultName,exceptFieldName,index,list,training,keyList)
    }

    runTesting(k = 1,classifiedName='something',resultName='Result',exceptFieldName=[]){
        let objKeyList = Object.keys(this.validation[0])
        let result = this.processOne(k,classifiedName,resultName,exceptFieldName,0,this.validation,this.training,objKeyList)
        return {
            k:k,
            accuracy:this.calculateAccuracy(result,classifiedName,resultName)
        }

    }

    run(k = 1,classifiedName='something',resultName='Result',exceptFieldName=[]){
        let objKeyList = Object.keys(this.validation[0])
        let data = this.processOne(k,classifiedName,resultName,exceptFieldName,0,this.validation,this.training,objKeyList)
        return {
            k,
            data
        }
    }

    calculateAccuracy(raw = [],classifiedName='something',resultName='Result'){
        return (raw.filter(item => item[classifiedName] === item[resultName]).length / raw.length) * 100
    }
}

module.exports = KnnRecursion