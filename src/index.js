const mime = require("mime-types")
const CryptoJS = require("crypto-js")

const config = (ctx) => {
  let userConfig = ctx.getConfig('picBed.ucloud')
  if (!userConfig) {
    userConfig = {}
  }
  const config = [
    {
      name: 'bucket',
      type: 'input',
      default: userConfig.bucket || '',
      required: true
    },
    {
      name: 'public_key',
      type: 'input',
      default: userConfig.public_key || '',
      required: true
    },
    {
      name: 'private_key',
      type: 'input',
      default: userConfig.private_key || '',
      required: true
    }
  ]
  return config
}

const handle = async (ctx) => {
  let bucket = ctx.getConfig("picBed.ucloud.bucket")
  let public_key = ctx.getConfig('picBed.ucloud.public_key')
  let private_key = ctx.getConfig('picBed.ucloud.private_key')
  if (!bucket || !public_key || !private_key) {
    throw new Error('Can\'t find ucloud config')
  }
  try {
    const imgList = ctx.output
    for (const img of imgList) {
      let mime_type = mime.lookup(img.fileName)
      let md5 = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(img.buffer.toString('binary'))).toString()
      let newFileName = "/image/" + md5 + img.extname
      let key = "/" + bucket + newFileName
      let stringToSign = "PUT\n\n" + mime_type + "\n\n" + key
      let hash = CryptoJS.HmacSHA1(stringToSign, private_key)
      let signature = CryptoJS.enc.Base64.stringify(hash)
      let token = "UCloud " + public_key + ":" + signature
      const res = await ctx.Request.request({
        method: "PUT",
        url: "https://" + bucket + ".cn-gd.ufileos.com" + newFileName,
        headers: {
          "Authorization": token,
          "Content-Length": img.buffer.length,
          "Content-Type": mime_type
        },
        body: img.buffer
      }, function(error, response, body) {
        if (error) {
          console.log(body)
          throw new Error("Upload failed")
        }
        if (response.statusCode === 200) {
          img.imgUrl = "http://" + bucket + ".cn-gd.ufileos.com" + newFileName
        }
      })
    }
    return ctx
  } catch (err) {
    ctx.emit('notification', {
      title: 'Upload failed',
      body: 'Please check the configuration'
    })
    throw err
  }
}

module.exports = (ctx) => {
  const register = () => {
    ctx.helper.uploader.register('ucloud', {
      handle,
      config: config
    })
  }
  return {
    uploader: 'ucloud',
    register
  }
}
