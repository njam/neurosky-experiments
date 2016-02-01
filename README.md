NeuroSky Experiments
====================

Device
------
MindCap XL ([MindTec](http://www.mindtecstore.com/en/mindcap-xl), [Amazon](http://www.amazon.de/MindCap-XL/dp/B00H8NQ75Y))
(NeuroSky's [TGAM EEG sensor](http://store.neurosky.com/products/eeg-tgam) sending data over Bluetooth)

Thinkgear Connector
-------------------
Download and install: http://developer.neurosky.com/docs/doku.php?id=thinkgear_connector_tgc

Start `ThinkGearConnector.app`. It might be easier to run the binary from a terminal, to see the debug output regarding the Bluetooth connection:
Run:
```
/Applications/ThinkGearConnector.app/Contents/MacOS/ThinkGearConnector
```

Streams
-------
All streams operate on objects of type `Sample`.
- mongodb/reader: Reads samples from the given collection
- mongodb/writer: Writes samples to the given collection
- fft/sampler: Reads samples' `rawEeg` value and transforms to samples with `spectrum` (type `Spectrum`)
- stream/printer: Prints to STDOUT

ThinkgearClient
---------------
Client for the *Thinkgear Connector* server.
Emits data as specified by the [TGSP protocol](http://developer.neurosky.com/docs/lib/exe/fetch.php?media=thinkgear_socket_protocol.pdf).

```js
ThinkgearClient.createClient({appName: 'record'}, function(thinkgear) {
  thinkgear.on('data', function(data) {
    console.log(data);
  });
});
```

The `eegPower` event's frequencies are ([docu](http://developer.neurosky.com/docs/doku.php?id=thinkgear_communications_protocol)):
- `delta`: 0.5 - 2.75Hz
- `theta'`: 3.5 - 6.75Hz
- `lowAlpha`: 7.5 - 9.25Hz
- `highAlpha`: 10 - 11.75Hz
- `lowBeta`: 13 - 16.75Hz
- `highBeta`: 18 - 29.75Hz
- `lowGamma`: 31 - 39.75Hz
- `highGamma`: 41 - 49.75Hz
