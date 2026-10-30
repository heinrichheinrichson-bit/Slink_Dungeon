const fs=require('fs'),p='outputs/nurbi-android/';const put=(f,s)=>fs.writeFileSync(p+f,s);
put('settings.gradle',`pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }
dependencyResolutionManagement { repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS); repositories { google(); mavenCentral() } }
rootProject.name = 'NurbiDungeonsTest'
include ':app'
`);
put('build.gradle',`plugins { id 'com.android.application' version '8.13.2' apply false }\n`);
put('gradle.properties',`org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8\nandroid.useAndroidX=false\n`);
put('local.properties',`sdk.dir=C:/Users/heinr/AppData/Local/Android/Sdk\n`);
put('app/build.gradle',`plugins { id 'com.android.application' }
android {
 namespace 'com.nurbi.dungeons.test'
 compileSdk 36
 defaultConfig { applicationId 'com.nurbi.dungeons.test'; minSdk 26; targetSdk 34; versionCode 1; versionName '0.1.0-test' }
 buildTypes { debug { debuggable true } }
}
`);
put('app/src/main/AndroidManifest.xml',`<manifest xmlns:android="http://schemas.android.com/apk/res/android"><application android:label="Nurbi Dungeons · Test" android:icon="@drawable/app_icon" android:theme="@android:style/Theme.Material.NoActionBar" android:allowBackup="false" android:usesCleartextTraffic="false" android:hardwareAccelerated="true"><activity android:name=".MainActivity" android:exported="true" android:configChanges="orientation|screenSize|keyboardHidden"><intent-filter><action android:name="android.intent.action.MAIN"/><category android:name="android.intent.category.LAUNCHER"/></intent-filter></activity></application></manifest>`);
put('app/src/main/res/drawable/app_icon.xml',`<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108"><path android:fillColor="#26372b" android:pathData="M0,0h108v108h-108z"/><path android:fillColor="#d9c99e" android:pathData="M24,65C23,26 68,19 83,25C83,65 57,87 30,73L51,51L27,68Z"/></vector>`);
put('app/src/main/java/com/nurbi/dungeons/test/MainActivity.java',`package com.nurbi.dungeons.test;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.*;
import android.net.Uri;
import java.io.*;
import java.util.Collections;

public class MainActivity extends Activity {
 private WebView web;
 private static final String HOST="nurbi.local";
 @Override public void onCreate(Bundle saved) {
  super.onCreate(saved);
  getWindow().setStatusBarColor(0xff202923);getWindow().setNavigationBarColor(0xff202923);
  web=new WebView(this);web.setBackgroundColor(0xff202923);setContentView(web);
  WebSettings s=web.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setAllowFileAccess(false);s.setAllowContentAccess(false);s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);s.setSupportMultipleWindows(false);s.setMediaPlaybackRequiresUserGesture(true);
  web.setWebViewClient(new WebViewClient(){
   @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){Uri u=r.getUrl();return !"https".equals(u.getScheme())||!HOST.equals(u.getHost());}
   @Override public WebResourceResponse shouldInterceptRequest(WebView v,WebResourceRequest r){
    Uri u=r.getUrl();String path=u.getPath();
    if(!"https".equals(u.getScheme())||!HOST.equals(u.getHost())||path==null||path.contains(".."))return missing();
    if(path.equals("/"))path="/spielrunde.html";
    String mime=path.endsWith(".js")?"application/javascript":path.endsWith(".css")?"text/css":"text/html";
    try{return new WebResourceResponse(mime,"UTF-8",200,"OK",Collections.singletonMap("Cache-Control","no-cache"),getAssets().open(path.substring(1)));}catch(IOException e){return missing();}
   }
  });
  web.setWebChromeClient(new WebChromeClient());web.loadUrl("https://"+HOST+"/spielrunde.html");
 }
 private WebResourceResponse missing(){return new WebResourceResponse("text/plain","UTF-8",404,"Not Found",Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));}
 @Override public void onBackPressed(){web.evaluateJavascript("(function(){var b=document.getElementById('home');if(b&&!b.hidden){b.click();return true;}return false;})()",value->{if(!"true".equals(value))finish();});}
 @Override protected void onPause(){super.onPause();web.onPause();}
 @Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}
 @Override protected void onDestroy(){web.destroy();super.onDestroy();}
}
`);
for(const f of ['spielrunde.css','spielrunde.js','world.js'])fs.copyFileSync('outputs/nurbis-dungeons/'+f,p+'app/src/main/assets/'+f);
let html=fs.readFileSync('outputs/nurbis-dungeons/spielrunde.html','utf8').replace('<a href="steinstudie.html">Zu den Materialstudien</a>','<span>Android-Test · 24 Räume · offline</span>').replace('Die bisherigen Einzelräume bleiben erhalten.','Lösungshilfen in jedem Raum unter „Tester“.');put('app/src/main/assets/spielrunde.html',html);
