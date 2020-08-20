# Picgo Plugin Ucloud

This repository is a [PicGo](https://github.com/PicGo/PicGo-Core) plugin for uploading images to [ucloud](https://ucloud.cn). The upload image will be renamed as `<image_md5>.<file_ext>`.

## How to install

Assume that you have Git and NodeJs/Npm environment, open your powershell.

1. Clone/Download this repository to PicGo configuration folder.

In windows, it's `C:\Users\<your username>\.picgo\`

In linux and mac, it's `~/.picgo/`

```bash
git clone https://github.com/Wsine/picgo-plugin-ucloud.git
```

2. Install the plugin

```bash
picgo install ucloud
```

## How to config

```json
{
  "picBed": {
    "uploader": "ucloud",
    "current": "ucloud",
    "ucloud": {
      "bucket": "<your bucket>",
      "public_key": "<your public key>",
      "private_key": "<your private key>"
    }
  },
  "picgoPlugins": {
    "picgo-plugin-ucloud": true
  }
}
```

You may want to modify the `region` and `folder` variables in `src/index.js` file.
