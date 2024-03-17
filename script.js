const http = require("http");
const fs = require("fs");
const axios  = require("axios");

const homeFile = fs.readFileSync("index.html","UTF-8");
console.log("successfully loaded")

const replaceData = (oldVal,newVal) => { 
    let temperature = oldVal.replace("{%location%}",newVal.location.name);
    temperature = temperature.replace("{%temperature%}",newVal.current.temp_c);
    temperature = temperature.replace("{%wind%}",newVal.current.wind_kph);
    temperature = temperature.replace("{%Time%}",newVal.location.localtime);
    return temperature;
}
const apiKey = "9fa3194201774b0e9ff200825241503";
const city = "bangalore";


const serverStart = http.createServer((req,res)=>{
    if(req.url == '/'){
        axios.get('http://api.weatherapi.com/v1/current.json?key='+apiKey+'&q='+city)
        .then(function (response){
            let arrData = [response.data];
            let realD = arrData.map((val)=>replaceData(homeFile,val));
            let concetratedData = realD.join(" ");
            res.writeHead(200,{'Content-Type' : 'html'});
            fs.writeFileSync('rendered.html',concetratedData);
            res.write(concetratedData);
            res.end();
            console.log(response.data);
        })
        .catch(function (err){
            console.log(err);
            res.end("file not found")
        })
        .finally(function (){
            console.log("working fine")
        })
    }
})

serverStart.listen(8080,"127.0.0.1");

