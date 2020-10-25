const express = require("express");
const app = express();
const { QAClient } = require("question-answering");
var formidable = require('formidable');
let {PythonShell} = require('python-shell')
//var fs = require('fs');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
const speech = require('@google-cloud/speech');
const fs = require('fs').promises;
const client = new speech.SpeechClient();
app.use(express.static('public'));

var a ='Oskarinleike with fries In Finland, the dish called Wieninleike ("Viennese cutlet"), is almost always made of pork, breaded and fried like the original. It is usually served with French fries, potato mash, or wedge potatoes. A slice of lemon, a slice of anchovy, and a few capers are placed on top of the cutlet. Usually, the dish includes a small amount of salad made from fresh vegetables. The dish was popular between the end of the Second World War and the 1990s, when it could be found in most low-end restaurants in Finland. In past decades, its popularity has been dimmed by the rise of fast food. Wieninleike and its variations remain a staple of menus in many non-ethnic or fine dining restaurant in Finland. Lunch restaurants, highway rest stops and restaurants attached to gas stations are most prominently associated with this type of menu in Finland. Wieninleike served typically with slice of lemon, anchovy, and caper Floridanleike served with fried peach and served with Béarnaise sauce Havaijinleike served with fried pineapple Holsteininleike served with egg, anchovy, and caper Metsästäjänleike served with mushroom sauce Oskarinleike served with choron-sauce, shrimps or lobster, and asparagus Oopperaleike served with fried egg Sveitsinleike is filled with smoked ham and Emmentaler cheese Typically the dishes above are prepared from pork. France Pariser schnitzel is similar to Wiener Schnitzel but is floured and fried in an egg batter instead of using breadcrumbs. Germany In Germany, the term Schnitzel means cutlets in general, not just breaded, f'

app.post("/search",function(req,res){
  (async ()=>{
    var a = await askQ(req.body.question,req.body.textToSearch,res);
    console.log(req.body.textToSearch);
    console.log(req.body.question);
  })();
})
app.get("/",function(req, res){
  res.sendFile(__dirname + "/index.html");
});
app.get("/select",function(req, res){
  res.sendFile(__dirname + "/select.html");
});
app.get("/analyzeRec",function(req, res){
  res.sendFile(__dirname + "/analyzeAudio.html");
});
app.post("/fileupload",function(req,res){
  var newPath;
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var oldpath = files.filetoupload.path;
    newpath = __dirname + "/file.flac";
    // fs.rename(oldpath, newpath, function (err) {
    //   if (err) throw err;
    //   res.write('File uploaded and moved!');
    //   res.end();
    // });
    readFile(oldpath);
    async function readFile(path){
      // The name of the audio file to transcribe
      //const fileName = './flactest.flac';

      // Reads a local audio file and converts it to base64
      const file = await fs.readFile(path);
      const audioBytes = file.toString('base64');

      const audio = {
        content: audioBytes,
      };
      const config = {
        encoding: 'FLAC',
        languageCode: 'en-US',
      };
      const request = {
        audio: audio,
        config: config,
      };
      const [response] = await client.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

        console.log(transcription + " ist");
      //askQ("when was the super bowl?",transcription);
      let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: __dirname,
        args: [transcription]
      };

      PythonShell.run('py.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        res.redirect("/final?shortText="+transcription);
      });
      console.log(`Transcription: ${transcription}`);
    }
});
})
app.get("/final",function(req,res){
  res.sendFile(__dirname + "/index1.html")
})
async function askQ(q,text,res){
  const question = q;
  (async () => {
    const qaClient = await QAClient.fromOptions();
    const answer = await qaClient.predict(question, text);

    res.redirect("/final?shortText="+text+"&answer="+answer.text)
    console.log(answer);
  })();
}
app.listen(3000,function(){
  console.log("listening");
})
