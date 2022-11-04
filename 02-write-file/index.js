const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
let byeMessage = "Спасибо за использование приложения, поставьте автору хорошую оценку и да прибудет с Вами сила Джедаев!"

const output = fs.createWriteStream(path.join(__dirname, '/output_file.txt'), 'utf-8');
console.log('Здравствуйте! Введите пожалуйста Ваш текст, он сохранится в output_file.txt')

stdin.on('SIGINT', () => console.log('Bye'))

stdin.on('data', data => {
    if(data.toString().trim() !== "exit"){
        output.write(data)
    }else{
        process.exit(console.log(byeMessage))
    }
});

process.on('SIGINT', () => {
    process.exit(console.log(byeMessage));
  });

