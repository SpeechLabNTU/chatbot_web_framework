const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const path = require('path')

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

                res.json({
                    path: req.file.path,
                    name: req.file.filename,
                    originalname: req.file.originalname,
                })
            })
    }

    static async deleteFiles(req, res, next) {
        fs.readdir('./storage', (err,files) => {
          files.forEach( file => {
            if (['.wav', '.mp3', '.mp4'].includes(path.extname(file))) {
              fs.unlinkSync('./storage/'+file)
            }
          })
        })
        res.send('done')
      }
}

module.exports = AudioController
