const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const request = require("request");

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

//start app
const port = process.env.PORT || 3000;

app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);
let resource;
app.get('/reports', async (req, res) =>{
    const resources = 'ae9f9e77df7e7112b53a706625977e477553deb15f4f19e2d97c1c7edfbfc968';
    console.log('THIS IS THE RESOURCE CODE')
    console.log(resource);
    const options = {
        method: 'GET',
        url: `https://www.virustotal.com/vtapi/v2/file/report?apikey=6e36fa142ca23dbe4fc603d019b0ba8a6f3d3ca977706dfc52d74698a212f098&resource=${resource}&allinfo=false`
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.send(body);
    });
})
app.post('/upload-avatar', async (req, res) => {

    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            const file = req.files.file;
            console.log(file.name)

            //Use the mv() method to place the file in the upload directory (i.e. "uploads")
            await file.mv('./uploads/' + file.name);
            const options = {
                method: 'POST',
                url: 'https://www.virustotal.com/vtapi/v2/file/scan',
                headers: {accept: 'text/plain', 'content-type': 'application/x-www-form-urlencoded'},
                form: {
                    apikey: '6e36fa142ca23dbe4fc603d019b0ba8a6f3d3ca977706dfc52d74698a212f098',
                    file: `./uploads/${file.name}`,
                }
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                console.log(file);
                console.log(file.name);
                resource = JSON.parse(body).resource;
                console.log('HERE IS THE SECOND RESOURCE CODE')
                console.log(JSON.parse(body).resource)
                res.send(body);
            });
            //send response
            //res.send(file);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});