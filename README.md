This is a starter template for [Ionic](http://ionicframework.com/docs/) projects.

## How to use this template

*This template does not work on its own*. The shared files for each starter are found in the [ionic2-app-base repo](https://github.com/ionic-team/ionic2-app-base).

To use this template, either create a new ionic project using the ionic node.js utility, or copy the files from this repository into the [Starter App Base](https://github.com/ionic-team/ionic2-app-base).

### With the Ionic CLI:

Take the name after `ionic2-starter-`, and that is the name of the template to be used when using the `ionic start` command below:

```bash
$ sudo npm install -g ionic cordova
$ ionic start mySideMenu sidemenu
```

Then, to run it, cd into `mySideMenu` and run:

```bash
$ ionic cordova platform add ios
$ ionic cordova run ios
```

Substitute ios for android if not on a Mac.

### iOS Notes
```ionic cordova run ios -l -c --target="iPhone-7" --  --buildFlag="-UseModernBuildSystem=0"```

## PWA Production Build Command
npm run web:build

scp -i sportshitter.pem -r ~/Downloads/sporthitters-frontend-master/www/* ubuntu@ec2-18-221-245-232.us-east-2.compute.amazonaws.com:~/qordev_prod/app_frontend/

cp -r app_frontend_michael/* app_frontend/

# Run Locally With Node Version 10.10.0

mongodump -d sporthitterprod -o dump -u mbuser -p mindbowser --authenticationDatabase admin
scp -i sportshitter.pem -r ubuntu@ec2-18-221-245-232.us-east-2.compute.amazonaws.com:~/qordev_prod/api_backend/server/configs/dump ~/Downloads
mongorestore -d sportHitters ~/Downloads/dump

## This repo is massive and here are some culprits 
All sizes are in kB's. The pack column is the size of the object, compressed, inside the pack file.
size    pack   SHA                                       location
101590  35472  fa28860584ebb20260fe64f65e2265bee9dc8f68  plugins/card.io.cordova.mobilesdk/src/ios/CardIO/libCardIO.a
98386   52764  bca147ee95e286fb951df04a993590625e97073c  plugins/card.io.cordova.mobilesdk/src/ios/CardIO/libopencv_imgproc.a
85716   45681  75c861f55238dd6567f2eb7d5287311caca0843f  plugins/card.io.cordova.mobilesdk/src/ios/CardIO/libopencv_core.a
69899   69757  e8c1908b158358db620a762d4d2c332924f8492a  Archive.zip
58252   25661  1516a6bcea9cd07bea2fcbc21c4a0d715f759e14  plugins/com.paypal.cordova.mobilesdk/src/ios/PayPalMobile/libPayPalMobile.a
55069   11681  d23de2e6ffbe2df9a751011428cce42330a1424b  node_modules/node-sass/build/Release/sass.a
32103   13462  a936844ec5a0f26d29d93731e94a3af10cea375e  plugins/cordova-plugin-facebook4/src/ios/FBSDKCoreKit.framework/FBSDKCoreKit
23707   9605   5d99215a5fd34e4a26dbf2c47a5d3a887723e9e9  plugins/cordova-plugin-facebook4/src/ios/FBSDKShareKit.framework/FBSDKShareKit
23477   22638  cfae4de958164350c95e0bd04f9cef3b93851f4b  SH_Frontend.apk
22172   10442  4fee4f4b26a57eeaad5371a8996b8e6f932fe297  plugins/cordova-plugin-facebook4/src/ios/FBSDKCoreKit.framework/FBSDKCoreKit
