package com.bsev700.ultrasshservice.config;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import com.bsev700.ultrasshservice.util.securepreferences.SecurePreferences;
import com.bsev700.ultrasshservice.util.securepreferences.model.SecurityConfig;

/**
* Configurações
*/

public class Settings implements SettingsConstants
{
	private Context mContext;
	private SharedPreferences mPrefs;
	private SecurePreferences mPrefsPrivate;
	
	private static SecurityConfig minimumConfig = new SecurityConfig.Builder("fubgf777gf6")
		.build();
	
	public Settings(Context context) {
		mContext = context;
		
		mPrefs = PreferenceManager.getDefaultSharedPreferences(mContext);
		mPrefsPrivate = SecurePreferences.getInstance(mContext, "SecureData", minimumConfig);
	}
	
	
	public String getPrivString(String key) {
		String defaultStr = "";
	
		switch (key) {
			case PORTA_LOCAL_KEY:
				defaultStr = "1080";
			break;
		}
		
		return mPrefsPrivate.getString(key, defaultStr);
	}
	
	public SecurePreferences getPrefsPrivate() {
		return mPrefsPrivate;
	}
	
	
	/**
	* Config File
	*/
	
	public String getMensagemConfigExportar() {
		return mPrefs.getString(CONFIG_MENSAGEM_EXPORTAR_KEY, "");
	}

	public void setMensagemConfigExportar(String str) {
		SharedPreferences.Editor editor = mPrefs.edit();
		editor.putString(CONFIG_MENSAGEM_EXPORTAR_KEY, str);
		editor.apply();
	}
	
	
	/**
	* Geral
	*/
	
	public String getIdioma() {
		return mPrefs.getString(IDIOMA_KEY, "default");
	}
	
	public void setIdioma(String str) {
		SharedPreferences.Editor editor = mPrefs.edit();
		editor.putString(IDIOMA_KEY, str);
		editor.apply();
	}
	/*
	public String getModoNoturno() {
		return mPrefs.getString(MODO_NOTURNO_KEY, "off");
	}
	
	public void setModoNoturno(String str) {
		SharedPreferences.Editor editor = mPrefs.edit();
		editor.putString(MODO_NOTURNO_KEY, str);
		editor.apply();
	}
	*/
/*	public boolean getModoDebug() {
		return mPrefs.getBoolean(MODO_DEBUG_KEY, false);
	}
	
	public void setModoDebug(boolean is) {
		SharedPreferences.Editor editor = mPrefs.edit();
		editor.putBoolean(MODO_DEBUG_KEY, is);
		editor.apply();
	}
	*/
	public int getMaximoThreadsSocks() {
		String n = mPrefs.getString(MAXIMO_THREADS_KEY, "8th");
		if (n == null || n.isEmpty()) {
			n = "8th";
		}
		return Integer.parseInt(n.replace("th", ""));
	}
	
	public boolean getHideLog() {
		return mPrefs.getBoolean(HIDE_LOG_KEY, false);
	}
	
	public boolean getAutoClearLog() {
		return mPrefs.getBoolean(AUTO_CLEAR_LOGS_KEY, false);
	}
	
	public boolean getIsFilterApps() {
		return mPrefs.getBoolean(FILTER_APPS, false);
	}
	
	public boolean getIsFilterBypassMode() {
		return mPrefs.getBoolean(FILTER_BYPASS_MODE, false);
	}
	
	public String[] getFilterApps() {
		String txt = mPrefs.getString(FILTER_APPS_LIST, "");
		if (txt.isEmpty()) {
			return new String[]{};
		}
		else {
			return txt.split("\n");
		}
	}
	
	public boolean getIsTetheringSubnet() {
		return mPrefs.getBoolean(TETHERING_SUBNET, false);
	}
	/*public boolean getIsSalvarPorta() {
		return mPrefs.getBoolean(SALVAR_PORTA, false);
	}*/
	
	public boolean getIsDisabledDelaySSH() {
		return mPrefs.getBoolean(DISABLE_DELAY_KEY, false);
	}
	public boolean wakelockAtivo() {
		return mPrefs.getBoolean(WAKELOCK, false);
	}

	
	/**
	* Vpn Settings
	*/
	
	public boolean getVpnDnsForward(){
		return mPrefs.getBoolean(DNSFORWARD_KEY, true);
	}
	
	public void setVpnDnsForward(boolean use){
		SharedPreferences.Editor editor = mPrefs.edit();
		editor.putBoolean(DNSFORWARD_KEY, use);
		editor.apply();
	}
	
	public String getVpnDnsResolver1(){
		String dns1 = mPrefs.getString(DNSRESOLVER1_KEY, "208.67.222.222");
		return dns1;
	}
	public String getVpnDnsResolver2(){
		String dns2 = mPrefs.getString(DNSRESOLVER2_KEY, "1.1.1.1");
		return dns2;
	}
	
	public void setVpnDnsResolver(String str) {
		if (str == null || str.isEmpty()) {
			str = "208.67.222.222";
		}
		SharedPreferences.Editor editor = mPrefs.edit();
		editor.putString(DNSRESOLVER1_KEY, str);
		editor.apply();
	}
	public void setVpnDnsResolver2(String str) {
		if (str == null || str.isEmpty()) {
			str = "1.1.1.1";
		}
		SharedPreferences.Editor editor = mPrefs.edit();
		editor.putString(DNSRESOLVER1_KEY, str);
		editor.apply();
	}

	public boolean getVpnUdpForward(){
		return mPrefs.getBoolean(UDPFORWARD_KEY, false);
	}
	
	public void setVpnUdpForward(boolean use){
		SharedPreferences.Editor editor = mPrefs.edit();
		editor.putBoolean(UDPFORWARD_KEY, use);
		editor.apply();
	}

	public String getVpnUdpResolver(){
		return mPrefs.getString(UDPRESOLVER_KEY, "127.0.0.1:7300");
	}
	
	public void setVpnUdpResolver(String str) {
		if (str == null || str.isEmpty()) {
			str = "127.0.0.1:7300";
		}
		SharedPreferences.Editor editor = mPrefs.edit();
		editor.putString(UDPRESOLVER_KEY, str);
		editor.apply();
	}
	
	/**
	* SSH Settings
	*/
	
	
	public String getSSHKeypath() {
		return mPrefs.getString(KEYPATH_KEY, "");
	}

	public int getSSHPinger() {
		String ping = mPrefs.getString(PINGER_KEY, "3");
		if (ping == null || ping.isEmpty()) {
			ping = "3";
		}
		return Integer.parseInt(ping);
	}
	public String getChaveRotear() {
		String chaveR = mPrefs.getString(ROTEAR_KEY, "");
		return chaveR;
	}
	

	/**
	* Utils
	*/
	
	public static void setDefaultConfig(Context context){
		SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
		SharedPreferences.Editor editor = prefs.edit();

		editor.putBoolean(DNSFORWARD_KEY, true);
		editor.putBoolean(DISABLE_DELAY_KEY, true);
		editor.putBoolean(WAKELOCK, true);
		editor.putString(DNSRESOLVER1_KEY, "208.67.222.222");
		editor.putString(DNSRESOLVER2_KEY, "1.1.1.1");
		editor.putBoolean(UDPFORWARD_KEY, true);
		editor.putString(UDPRESOLVER_KEY, "127.0.0.1:7300");
		//editor.putString(MODO_NOTURNO_KEY, "off");
		editor.putString(PINGER_KEY, "3");
		editor.putString(MAXIMO_THREADS_KEY, "8th");
		//editor.remove(MODO_DEBUG_KEY);
		editor.remove(HIDE_LOG_KEY);
		editor.remove(AUTO_CLEAR_LOGS_KEY);
		editor.remove(FILTER_APPS);
		editor.remove(FILTER_BYPASS_MODE);
		editor.remove(FILTER_APPS_LIST);
		editor.remove(TETHERING_SUBNET);
		//editor.remove(SALVAR_PORTA);
		//editor.remove(DISABLE_DELAY_KEY);
		//editor.remove(wakelock);

		editor.apply();
	}
	
	public static void clearSettings(Context context) {
		SharedPreferences priv = SecurePreferences.getInstance(context, "SecureData", minimumConfig);
		SharedPreferences.Editor edit = priv.edit();
		edit.clear();
		edit.apply();
	}
	public static void limparParteSettings(Context context) {
		SharedPreferences priv = SecurePreferences.getInstance(context, "SecureData", minimumConfig);
		SharedPreferences.Editor editor = priv.edit();
		//edit.clear();
		//editor.remove("connect_first_time");
		editor.apply();

		setDefaultConfig(context);
	}

    public static void setAtualizacao(Context context, int Versao) {
		SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
		SharedPreferences.Editor editor = prefs.edit();

		editor.putBoolean(DNSFORWARD_KEY, true);
		editor.putBoolean(DISABLE_DELAY_KEY, true);
		editor.putBoolean(WAKELOCK, true);
		//editor.putString(DNSRESOLVER1_KEY, "208.67.222.222");
		//editor.putString(DNSRESOLVER2_KEY, "1.1.1.1");
		editor.putBoolean(UDPFORWARD_KEY, true);
		editor.putString(UDPRESOLVER_KEY, "127.0.0.1:7300");

		//Remove att antiga
		editor.remove(String.valueOf(Versao-1));
    }
}
