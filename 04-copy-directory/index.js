const fs = require('fs');
const path = require('path');
const files = path.join(__dirname, 'files');
const filesCopy = path.join(__dirname, 'files-copy');


fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, ()=>{
})


fs.readdir(files, (err, fileInFolder) => {
    for(let file of fileInFolder){
        fs.copyFile(path.join(files, file), path.join(filesCopy, file), () => {
            fs.readdir(filesCopy, (err, filesF) => {
                fs.readdir(files, (err, filesOriginal) => {
                    for (let file of filesF){
                        if(!filesOriginal.includes(file)){
                            fs.unlink(path.join(filesCopy, file), () => {
                            })
                        }
                    }
                })
            })
        })
    }
})