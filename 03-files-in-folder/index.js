const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'secret-folder');

fs.readdir(folder, (err, files)=>{
    
    files.forEach((file) => {
        let fileSize = fs.stat(path.join(__dirname, 'secret-folder', file), (err, fileStats) => {
            if (err) {
              console.log(err)
            }
            if(fileStats.isFile()){
                console.log(`${file.split('.')[0]} - ${path.extname(file)} - ${fileStats.size / 1024}kb`)
            }
          })
    })
})


// fs.readdir('beforeExit', () => {
//     console.log(fileNames)
//     console.log(types)
//     console.log(sizes)
// })

// fs.stat('README.md', (err, fileStats) => {
//     console.log(fileStats)
// })
