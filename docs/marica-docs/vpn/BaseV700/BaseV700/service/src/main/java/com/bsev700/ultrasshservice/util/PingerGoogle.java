package com.bsev700.ultrasshservice.util;

import android.content.Context;
import com.bsev700.ultrasshservice.R;
import com.bsev700.ultrasshservice.logger.SkStatus;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicBoolean;

public class PingerGoogle extends Thread {
    private AtomicBoolean mConnected;
    private Context mContext;
    private boolean stopping = false;

    public PingerGoogle(AtomicBoolean atomicBoolean, Context context) {
        mConnected = atomicBoolean;
        mContext = context;
    }

    @Override
    public void run() {
        ArrayList<Long> arrayList = new ArrayList<>();
        int i = 4;
        while (i > 0 && mConnected.get() && !stopping) {
            try {
                Thread.sleep((long) 500);
                try {
                    long pingTestLatency = pingTestLatency(mContext);
                    if (i != 4) {
                        arrayList.add(new Long(pingTestLatency));
                    }
                } catch (IOException e) {
                    i++;
                }
                i--;
            } catch (InterruptedException e2) {
            }
        }
        long j = (long) 0;
        for (Long longValue : arrayList) {
            j += longValue.longValue();
        }
        if (!stopping) {
            try {
                long size = j / ((long) arrayList.size());
                if (mConnected.get() && size > ((long) 0)) {
                    SkStatus.logInfo(String.format("Ping Latency: %d ms", new Object[]{new Long(size)}));
                }
            } catch (Exception e3) {
            }
        }
    }

    @Override
    public void interrupt() {
        super.interrupt();
        stopping = true;
    }

    public long pingTestLatency(Context context) throws IOException {
        HttpURLConnection httpURLConnection = (HttpURLConnection) new URL("https", "www.google.com", "/generate_204").openConnection();
        httpURLConnection.setConnectTimeout(5000);
        httpURLConnection.setReadTimeout(5000);
        httpURLConnection.setInstanceFollowRedirects(false);
        httpURLConnection.setUseCaches(false);
        try {
            long currentTimeMillis = System.currentTimeMillis();
            httpURLConnection.getInputStream();
            long currentTimeMillis2 = System.currentTimeMillis() - currentTimeMillis;
            int responseCode = httpURLConnection.getResponseCode();
            if (responseCode == 204 || (responseCode == 200 && httpURLConnection.getContentLength() == 0)) {
                return currentTimeMillis2;
            }
            throw new Exception(context.getString(R.string.connection_test_error_status_code, new Object[]{new Integer(responseCode)}));
        } catch (Exception e) {
            throw new IOException(context.getString(R.string.connection_test_error, new Object[]{e.getMessage()}));
        }
    }
}