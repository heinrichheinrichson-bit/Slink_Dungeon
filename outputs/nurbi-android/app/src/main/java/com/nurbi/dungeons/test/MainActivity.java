package com.nurbi.dungeons.test;
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
