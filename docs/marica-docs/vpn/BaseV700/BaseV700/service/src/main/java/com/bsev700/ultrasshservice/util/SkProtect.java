package com.bsev700.ultrasshservice.util;

import android.content.Context;

import com.bsev700.ultrasshservice.BuildConfig;
import com.bsev700.ultrasshservice.R;
import com.bsev700.ultrasshservice.config.Settings;

/**
 * @author Skank3r
 */
public class SkProtect {

	private static final String TAG = SkProtect.class.getSimpleName();
	
	private static final String APP_BASE = "com.bsev700.br";
	
	// Assinatura da Google Play
	//private static final String APP_SIGNATURE = "XbhYZ4Bz/9F4cWLIDMg0wl/+jl8=\n";

	private static SkProtect mInstance;

	private Context mContext;
	private Settings mConfig;
	public static void init(Context context) {
		if (mInstance == null) {
			mInstance = new SkProtect(context);

			// This method will print your certificate signature to the logcat.
			//AndroidTamperingProtectionUtils.getCertificateSignature(context);

		}
	}

	private SkProtect(Context context) {
		mContext = context;
		mConfig = new Settings(mContext);
	}
	
	/*public void tamperProtect() {
		AndroidTamperingProtection androidTamperingProtection = new AndroidTamperingProtection.Builder(mContext, APP_SIGNATURE)
			.installOnlyFromPlayStore(false) // By default is set to false.
			.build();

		if (!androidTamperingProtection.validate()) {
			throw new RuntimeException();
		}
	}*/
	
	public void simpleProtect() {
		if (!(mConfig.getPrefsPrivate().getString("AppPkg", "").toLowerCase().contains(mContext.getPackageName().toLowerCase())) || !mConfig.getPrefsPrivate().getString("AppName", "").toLowerCase().contains(mContext.getString(R.string.app_name).toLowerCase())) {
			throw new RuntimeException();
		}
	}

	public static void CharlieProtect() {
		if (mInstance == null) return;
			
		mInstance.simpleProtect();
		
		// ative apenas ao enviar pra PlayStore
		//mInstance.tamperProtect();
	}
}
