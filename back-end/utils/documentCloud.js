const {google} = require('googleapis');
const fs = require('fs');
const credentials = require("../credentials.json");
require('dotenv').config();

const SCOPE =["https://www.googleapis.com/auth/drive"];

const authorize = async () => {
    const jwtClient = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        SCOPE
    );
    await jwtClient.authorize();
    return jwtClient;
};

const uploadFile = async (file) => {
    const authClient = await authorize();
    return new Promise((resolve, rejected) => {
        const drive = google.drive({version: "v3", auth: authClient});
        var fileMetaData = {
            name: file.filename,
            parents: [process.env.PARENT]
        };
        drive.files.create({
            resource: fileMetaData,
            media: {
                body: fs.createReadStream(file.path),
                mimeType: file.mimetype
            },
            fields: 'id, webViewLink' // Request the webViewLink field
        }, function(err, file) {   
            if (err) {
                
                return rejected(err);
            }
            // Resolve with both file id and webViewLink
            return resolve({id: file.data.webViewLink});
        });
    });
};

module.exports = {
    uploadFile
};
