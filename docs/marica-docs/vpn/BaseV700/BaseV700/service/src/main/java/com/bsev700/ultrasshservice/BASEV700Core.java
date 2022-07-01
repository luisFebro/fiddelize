package com.bsev700.ultrasshservice;

import android.content.Context;
import android.annotation.TargetApi;
import android.os.Build;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.graphics.Color;

/**
* @author SlipkHunter
*/
public class BASEV700Core
{
	private static BASEV700Core mInstance = null;
	private Context mContext;
	
	public static void init(Context context) {
		if (mInstance == null) {
			mInstance = new BASEV700Core(context);
		}
	}
	
	private BASEV700Core(Context context) {
		mContext = context;
		
		//throw new RuntimeException();
		TopExceptionHandler.init(mContext);
		
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            createNotificationChannels();
	}
	
	@TargetApi(Build.VERSION_CODES.O)
    private void createNotificationChannels() {
        NotificationManager mNotificationManager =
			(NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);

        // Background message
        CharSequence name = mContext.getString(R.string.channel_name_background);
        NotificationChannel mChannel = new NotificationChannel(BASEV700Service.NOTIFICATION_CHANNEL_BG_ID,
			name, NotificationManager.IMPORTANCE_MIN);

        mChannel.setDescription(mContext.getString(R.string.channel_description_background));
        mChannel.enableLights(false);

        mChannel.setLightColor(Color.DKGRAY);
        mNotificationManager.createNotificationChannel(mChannel);

        // Connection status change messages
        name = mContext.getString(R.string.channel_name_status);
        mChannel = new NotificationChannel(BASEV700Service.NOTIFICATION_CHANNEL_NEWSTATUS_ID,
			name, NotificationManager.IMPORTANCE_LOW);

        mChannel.setDescription(mContext.getString(R.string.channel_description_status));
        mChannel.enableLights(true);

        mChannel.setLightColor(Color.BLUE);
        mNotificationManager.createNotificationChannel(mChannel);


        // Urgent requests, e.g. two factor auth
        name = mContext.getString(R.string.channel_name_userreq);
        mChannel = new NotificationChannel(BASEV700Service.NOTIFICATION_CHANNEL_USERREQ_ID,
			name, NotificationManager.IMPORTANCE_HIGH);
        mChannel.setDescription(mContext.getString(R.string.channel_description_userreq));
        mChannel.enableVibration(true);
        mChannel.setLightColor(Color.CYAN);
        mNotificationManager.createNotificationChannel(mChannel);
    }
}
