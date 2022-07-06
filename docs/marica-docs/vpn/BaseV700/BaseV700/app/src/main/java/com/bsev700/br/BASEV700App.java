package com.bsev700.br;

import android.app.Application;

import android.content.Context;

import com.bsev700.ultrasshservice.BASEV700Core;
import android.content.res.Configuration;

/**
* App
*/
public class BASEV700App extends Application
{
	private static final String TAG = BASEV700App.class.getSimpleName();
	public static final String PREFS_GERAL = "BASEV700GERAL";


	private static BASEV700App mApp;

	@Override
	public void onCreate()
	{
		super.onCreate();

		mApp = this;

		// inicia
		BASEV700Core.init(this);
	}

	@Override
	protected void attachBaseContext(Context base) {
		super.attachBaseContext(base);
		//LocaleHelper.setLocale(this);
	}

	@Override
	public void onConfigurationChanged(Configuration newConfig) {
		super.onConfigurationChanged(newConfig);
		//LocaleHelper.setLocale(this);
	}


	public static BASEV700App getApp() {
		return mApp;
	}
}
