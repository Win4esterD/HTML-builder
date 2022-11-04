const fs = require('fs');
const path = require('path');
const {stdin, stdout} = process;

const stylesFolder = path.join(__dirname, 'styles');
const projectDist = path.join(__dirname, 'project-dist');

// fs.writeFile(path.join(projectDist, 'bundle.css'), 'content', () => {
//     console.log('bundle.css created')
// })
let writeStream = fs.createWriteStream(path.join(projectDist, 'bundle.css'))
fs.readdir(stylesFolder, (err, files)=>{
    for(let file of files){
        let fileSize = fs.stat(path.join(stylesFolder, file), (err, fileStat) => {
            if (err) {
                console.log(err)
            }
            if(fileStat.isFile() && path.extname(file) === '.css'){
                console.log(file)
                let stream = fs.createReadStream(path.join(stylesFolder, file), 'utf-8')
                stream.on('data', chunk => {
                    
                    writeStream.write(chunk, () => console.log('written'))
                    
                });
               
            }

        })
    }
})

