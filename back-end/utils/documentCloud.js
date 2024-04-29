const {google} = require('googleapis');
const fs = require('fs');
const credentials = require("../credentials.json");

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

const extractFileId =async (fileLink) => {
    const match = await fileLink.match(/\/file\/d\/([^/]+)/);
    return await match ? match[1] : null;
};

const deleteFile = async (fileId) => {
    const fileid = extractFileId(fileId);
    const authClient = await authorize();
    const drive = google.drive({ version: 'v3', auth: authClient });

    try {
        await drive.files.delete({
            fileId: fileid,
        });
        console.log('File deleted successfully.');
    } catch (error) {
        console.error('Error deleting file:', error.message);
        throw error;
    }
};


module.exports = {
    uploadFile,
    deleteFile
};
