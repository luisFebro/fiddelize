package com.bsev700.ultrasshservice.util;

import android.content.Context;
import android.os.PowerManager;
import android.os.PowerManager.WakeLock;

import com.bsev700.ultrasshservice.logger.SkStatus;

public class WakeLockManager {
    private Context mContext;
    private String mTag;
    private PowerManager powerManager;
    private WakeLock wakeLock;

    public WakeLockManager(Context context, String str) {
        String str2 = str;
        mContext = context;
        mTag = str2;
        powerManager = ((PowerManager) mContext.getSystemService(Context.POWER_SERVICE));
    }

    public synchronized void start() {
        synchronized (this) {
            wakeLock = powerManager.newWakeLock(1, this.mTag);
            wakeLock.acquire();
            SkStatus.logInfo("Wakelock Ativo!");
        }
    }

    public synchronized void stop() {
        synchronized (this) {
            if (wakeLock != null) {
                wakeLock.release();
                wakeLock = null;
                SkStatus.logInfo("Wakelock OFFLINE!");
            }
        }
    }
}