package com.bsev700.ultrasshservice.tunnel;

import android.content.Intent;
import android.os.Build;
import android.content.Context;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.bsev700.ultrasshservice.BASEV700Service;

public class TunnelManagerHelper
{

	public static void startBASEV700(Context context) {
        Intent startVPN = new Intent(context, BASEV700Service.class);
		
		if (startVPN != null) {
			TunnelUtils.restartRotateAndRandom();
			
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
			//noinspection NewApi
                context.startForegroundService(startVPN);
            else
                context.startService(startVPN);
        }
    }
	
	public static void stopBASEV700(Context context) {
		Intent stopTunnel = new Intent(BASEV700Service.TUNNEL_SSH_STOP_SERVICE);
		LocalBroadcastManager.getInstance(context)
			.sendBroadcast(stopTunnel);
	}
}
