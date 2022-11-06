const fs = require('fs');
const path = require('path');
const {stdin, stdout} = process;

const replaceHeader = '{{header}}'
const projectDist = path.join(__dirname, 'project-dist');
const stylesFolder = path.join(__dirname, 'styles')


fs.mkdir(projectDist, () => console.log('dir created'));

//Write Streams
const index = fs.createWriteStream(path.join(projectDist, 'index.html'));
const cssStream = fs.createWriteStream(path.join(projectDist, 'style.css'));


// Read Streams
const templateStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
const headerStream = fs.createReadStream(path.join(__dirname, 'components', 'header.html'), 'utf-8');
const articlesStream = fs.createReadStream(path.join(__dirname, 'components', 'articles.html'), 'utf-8');
const footerStream = fs.createReadStream(path.join(__dirname, 'components', 'footer.html'), 'utf-8');


let template = '';
let header = '';
let articles = '';
let footer = '';

let tags = []

/* templateStream.on('data', chunk => {
    template += chunk;
    headerStream.on('data', chunk => {
        header += chunk
        template = template.replace(replaceHeader, header);
        articlesStream.on('data', chunk => {
            articles += chunk;
            template = template.replace('{{articles}}', articles)
            footerStream.on('data', chunk => {
                footer += chunk;
                template = template.replace('{{footer}}', footer)
                index.write(template)
            })
        })
    })
    }) */

templateStream.on('data', chunk => {
    template += chunk;
    fs.readdir(path.join(__dirname, 'components'), async (err, filesInComponents) =>{
         for(let file of filesInComponents){
                if(template.includes(`{{${file.split('.')[0]}}}`)){
                    let tempStream = fs.createReadStream(path.join(__dirname, 'components', file), 'utf-8');
                    tempStream.on('data', chck => {
                        template = template.replace(`{{${file.split('.')[0]}}}`, chck)
                        let tempStream = fs.createWriteStream(path.join(projectDist, 'index.html'));
                        tempStream.write(template)
                    })
                }
        }
    })
})


fs.readdir(stylesFolder, (err, files)=>{
    for(let file of files){
        let fileSize = fs.stat(path.join(stylesFolder, file), (err, fileStat) => {
            if (err) {
                console.log(err)
            }
            if(fileStat.isFile() && path.extname(file) === '.css'){
                let stream = fs.createReadStream(path.join(stylesFolder, file), 'utf-8')
                stream.on('data', chunk => { 
                    cssStream.write(chunk+'\n'+'\n', () => console.log('written'))
                });
            }
        })
    }
})

//Copying assets to the project
const projectAssets = path.join(__dirname, 'project-dist', 'assets')
const assetsFolder = path.join(__dirname, 'assets')
fs.mkdir(projectAssets, {recursive: true}, ()=>{
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

recursiveCopy(assetsFolder, projectAssets)
recursiveRemove(projectAssets, assetsFolder)

