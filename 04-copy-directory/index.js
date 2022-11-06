const fs = require('fs');
const path = require('path');

const files = path.join(__dirname, 'files');
const filesCopy = path.join(__dirname, 'files-copy');


fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, ()=>{
})



function recursiveCopy(from, to){
    fs.readdir(from, (err, filesInFolder)=>{
        for(let file of filesInFolder){
            fs.stat(path.join(from, file), (err, fileStat) => {
                if(fileStat.isFile()){
                    fs.copyFile(path.join(from, file), path.join(to, file), () => {console.log('file copied')})
                }else{
                    console.log('recursive')
                    let newDir = path.join(to, file)
                    fs.mkdir(newDir, {recursive: true}, ()=> {})
                    recursiveCopy(path.join(from, file), newDir)
                }
            })
        }
    })
}

function recursiveRemove(proDist, assetsFolder){
    fs.readdir(proDist, (err, filesInProDist) =>{
        fs.readdir(assetsFolder, (err, filesInAssets)=>{
            for(let file of filesInProDist){
                fs.stat(path.join(proDist, file), (err, fileStat)=>{
                    if(!fileStat.isFile() && !filesInAssets.includes(file)){
                        fs.rm(path.join(proDist, file), { recursive: true, force: true }, () => {console.log(`remove dir ${file}`)})
                    }else if(fileStat.isFile() && !filesInAssets.includes(file)){
                        fs.unlink(path.join(proDist, file), () => {console.log(`removed file ${file}`)})
                    }else if(!fileStat.isFile() && filesInAssets.includes(file)){
                        console.log('recursive remove')
                        recursiveRemove(path.join(proDist, file), path.join(assetsFolder, file))
                    }
                })
            }
        })
        })
}

recursiveCopy(files, filesCopy)
recursiveRemove(filesCopy, files)
