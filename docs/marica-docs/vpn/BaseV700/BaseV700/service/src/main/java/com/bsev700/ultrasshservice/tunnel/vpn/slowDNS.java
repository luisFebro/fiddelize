package com.bsev700.ultrasshservice.tunnel.vpn;

import android.content.Context;
import android.util.Log;

import com.bsev700.ultrasshservice.logger.SkStatus;
import com.bsev700.ultrasshservice.util.CustomNativeLoader;
import com.bsev700.ultrasshservice.util.StreamGobbler;

import java.io.File;
import java.io.IOException;

public class slowDNS extends Thread {
	private final static String TAG = "DnsThread";
	private final static String DNS_BIN = "libstartdns";
	
	private OnDnsListener mListener;
	public interface OnDnsListener {
		public void onStart();
		public void onStop();
	}
	
	private Process dnsProcess;
	private File filedns;
	
	private Context mContext;
	private String chave;
	private String nameserver;
	private String dns;
	
	public slowDNS(Context context, String dnsChave, String dnsNS, String dnsI) {
		mContext = context;

		chave = dnsChave;
		nameserver = dnsNS;
		dns = dnsI;
	}

	@Override
	public void run() {
		
		if (mListener != null) {
			mListener.onStart();
		}
		
		try {
			//ApplicationInfo appInfo = mContext.getApplicationInfo();
			//String filedns = appInfo.nativeLibraryDir;

			StringBuilder cmd = new StringBuilder();
			//File filePdnsd = CustomNativeLoader.loadExecutableBinary(mContext, "libpdnsd.so");

			filedns = CustomNativeLoader.loadNativeBinary(mContext, DNS_BIN, new File(mContext.getFilesDir(), DNS_BIN));

		//	Log.e("conexao", "filedns: "+filedns);

			if (!filedns.exists()) {
				throw new IOException("Conexao BIN não encontrado");
			}

			cmd.append(filedns.getCanonicalPath());
			cmd.append(" -udp " + dns + ":53   -pubkey " + chave + " " + nameserver + " 127.0.0.1:2222");


			dnsProcess = Runtime.getRuntime().exec(cmd.toString());

			StreamGobbler.OnLineListener onLineListener = new StreamGobbler.OnLineListener(){
				@Override
				public void onLine(String log){
					SkStatus.logDebug("Dns: " + log);
					Log.e("conexao", log);
				}
			};

			StreamGobbler stdoutGobbler = new StreamGobbler(dnsProcess.getInputStream(), onLineListener);
			StreamGobbler stderrGobbler = new StreamGobbler(dnsProcess.getErrorStream(), onLineListener);

			stdoutGobbler.start();
			stderrGobbler.start();



			dnsProcess.waitFor();

			//Log.e("conexao", "cmd: "+cmd.toString());
			//Log.e("conexao", "dnsProcess.getInputStream(): "+dnsProcess.getInputStream());
			//Log.e("conexao", "dnsProcess.getErrorStream(): "+dnsProcess.getErrorStream());

		} catch (IOException e) {
			SkStatus.logException("Dns Error", e);
			Log.e("conexao", "IOException: "+e.toString());
		} catch(Exception e){
			SkStatus.logDebug("Dns Error: " + e);
			Log.e("conexao", "Exception: "+e.toString());
		}

		dnsProcess = null;
		if (mListener != null) {
			mListener.onStop();
		}

	}

	@Override
	public synchronized void interrupt()
	{
		// TODO: Implement this method
		super.interrupt();
		
		if (dnsProcess != null)
			dnsProcess.destroy();
			
		try {
			if (filedns != null)
				VpnUtils.killProcess(filedns);
		} catch(Exception e) {
			Log.e("BASEV700", e.toString());
		}

		dnsProcess = null;
		filedns = null;
	}
	
	public void setOnDnsListener(OnDnsListener listener){
		this.mListener = listener;
	}
}
