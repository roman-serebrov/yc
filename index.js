import fetch, {Headers} from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import screenshot from 'screenshot-desktop';
import fs from 'fs';

screenshot().then((img) => {
    const id = uuidv4();
    saveScreenshot(img, id);
    recognizeTextFromImage(img, id);

}).catch((err) => {
    console.error(err);
});

function saveScreenshot(buffer, id) {
    fs.writeFile(`${id}.png`, buffer, (err) => {
        if (err) return console.error('Cannot save buffer as png file');
        console.log('Buffer has been saved as png file');
    });
}

function recognizeTextFromImage(buffer, id) {
    const body = {
        "analyze_specs": [{
            "content": buffer.toString('base64'),
            "features": [{
                "type": "TEXT_DETECTION",
                "text_detection_config": {
                    "language_codes": ["*"]
                }
            }]
        }]
    };

    fetch("https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze", {
        body: JSON.stringify(body),
        headers: new Headers({
            Authorization: `Api-Key ${process.env.IAM_TOKEN}`,
            "Content-Type": "application/json"
        }),
        method: "POST"
    }).then(async result => {
        const data = await result.json();
        fs.writeFile(`${id}.txt`, JSON.stringify(data), function (err) {
            if (err) return console.error('Cannot save buffer as txt file');
            console.log('Buffer has been saved as text file');
        });
    });
}
