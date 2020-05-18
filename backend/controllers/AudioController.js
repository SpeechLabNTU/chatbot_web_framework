const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')

class AudioController {

    static async convertToWAV(req, res, next){

        var file = req.file
        ffmpeg()
            .input(file.path)
            .audioChannels(1)  //convert to mono
            .save(file.path.split('.')[0]+'_converted.wav')  //convert to .wav
            .on('end', ()=>{
                if (fs.existsSync(file.path)) { // clean original file after converting
                    fs.unlinkSync(file.path)
                }
                req.file.mimetype = 'audio/x-wav'
                req.file.filename = file.filename.split('.')[0]+'_converted.wav'
                req.file.path = file.path.split('.')[0]+'_converted.wav'

                next()
            })
    }
}

module.exports = AudioController