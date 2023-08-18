import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:liveness_plugin/liveness_plugin.dart';

class LivenessDetection extends StatefulWidget {
  // This class is the configuration for the state.
  // It holds the values (in this case nothing) provided
  // by the parent and used by the build  method of the
  // State. Fields in a Widget subclass are always marked
  // "final".

  const LivenessDetection({super.key});

  @override
  State<LivenessDetection> createState() => _LivenessDetectionState();
}

class _LivenessDetectionState extends State<LivenessDetection>
    implements LivenessDetectionCallback {
  @override
  void initState() {
    super.initState();
    LivenessPlugin.initSDKOfLicense(Market.Thailand);
    LivenessPlugin.setDetectionLevel(DetectionLevel.NORMAL);
  }

  void _startLivenessDetection() async {
    LivenessPlugin.getSDKVersion.then((sdkVersion) {
      print(sdkVersion);
    });

    String license = "";
    String result = await LivenessPlugin.setLicenseAndCheck(license);
    print(result);
    if ("SUCCESS" == result) {
      // license is valid
      LivenessPlugin.startLivenessDetection(this);
    } else {
      // license is invalid, expired/format error /appId is invalid
      print("license is invalid: $result");
    }
  }

  @override
  void onGetDetectionResult(bool isSuccess, Map resultMap) {
    print(resultMap);
    showResultDialog(context, resultMap["code"], resultMap["base64Image"]);
  }

  showResultDialog(
      BuildContext context, String resultCode, String base64Image) {
    Uint8List imageBytes = base64.decode(base64Image);

    // set up the button
    Widget okButton = TextButton(
      child: Text("OK"),
      onPressed: () {
        Navigator.of(context).pop();
      },
    );

    // set up the AlertDialog
    AlertDialog alert = AlertDialog(
      title: Text("Liveness Detection Result: $resultCode"),
      content: SingleChildScrollView(
        child: Image.memory(
          imageBytes,
        ),
      ),
      actions: [
        okButton,
      ],
    );

    // show the dialog
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return alert;
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called,
    // for instance, as done by the _increment method above.
    // The Flutter framework has been optimized to make
    // rerunning build methods fast, so that you can just
    // rebuild anything that needs updating rather than
    // having to individually changes instances of widgets.
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        ElevatedButton(
          onPressed: _startLivenessDetection,
          child: const Text('Start Liveness Detection'),
        ),
        // const SizedBox(width: 16),
        // Text('Count: $_counter'),
      ],
    );
  }
}
