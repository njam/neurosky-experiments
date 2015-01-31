NeuroSky Experiments
====================

Device
------
MindCap XL ([MindTec](http://www.mindtecstore.com/en/mindcap-xl), [Amazon](http://www.amazon.de/MindCap-XL/dp/B00H8NQ75Y))
(NeuroSky's [TGAM EEG sensor](http://neurosky.com/products-markets/eeg-biosensors/hardware/) sending data over Bluetooth)

Thinkgear Connector
-------------------
Download and install: http://developer.neurosky.com/docs/doku.php?id=thinkgear_connector_tgc

Start `ThinkGearConnector.app`. It might be easier to run the binary from a terminal, to see the debug output regarding the Bluetooth connection:
Run:
```
/Applications/ThinkGearConnector.app/Contents/MacOS/ThinkGearConnector
```

ThinkgearClient
---------------
Client for the *Thinkgear Connector server*.
Emits data as specified by the [TGSP protocol](http://developer.neurosky.com/docs/lib/exe/fetch.php?media=thinkgear_socket_protocol.pdf).

```js
var thinkgear = ThinkgearClient.create({
  appName: 'foo',
  appKey: sha1('foo'),
  enableRawOutput: false
});
thinkgear.on('data', function (data) {
  console.log(data);
});
```

The `eegPower` event values frequencies ([docu](http://developer.neurosky.com/docs/doku.php?id=thinkgear_communications_protocol)):
- `delta`: 0.5 - 2.75Hz
- `theta'`: 3.5 - 6.75Hz
- `lowAlpha`: 7.5 - 9.25Hz
- `highAlpha`: 10 - 11.75Hz
- `lowBeta`: 13 - 16.75Hz
- `highBeta`: 18 - 29.75Hz
- `lowGamma`: 31 - 39.75Hz
- `highGamma`: 41 - 49.75Hz
