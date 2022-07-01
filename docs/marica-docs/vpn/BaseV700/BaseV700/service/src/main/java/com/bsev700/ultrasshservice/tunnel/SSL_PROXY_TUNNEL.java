package com.bsev700.ultrasshservice.tunnel;

import android.content.Context;

import com.bsev700.ultrasshservice.BuildConfig;
import com.bsev700.ultrasshservice.logger.SkStatus;
import com.trilead.ssh2.HTTPProxyException;
import com.trilead.ssh2.ProxyData;
import com.trilead.ssh2.crypto.Base64;
import com.trilead.ssh2.sftp.Packet;
import com.trilead.ssh2.transport.ClientServerHello;

import org.conscrypt.Conscrypt;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.channels.SocketChannel;
import java.security.Security;
import java.util.Arrays;

import javax.net.ssl.HandshakeCompletedEvent;
import javax.net.ssl.HandshakeCompletedListener;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;


public class SSL_PROXY_TUNNEL implements ProxyData
{

	private Context mContext;
	//public Socket sock;


	class HandshakeTunnelCompletedListener implements HandshakeCompletedListener {
		private final String val$host;
		private final int val$port;
		private final SSLSocket val$sslSocket;

		HandshakeTunnelCompletedListener( String str, int i, SSLSocket sSLSocket) {
			this.val$host = str;
			this.val$port = i;
			this.val$sslSocket = sSLSocket;
		}

		public void handshakeCompleted(HandshakeCompletedEvent handshakeCompletedEvent) {
			// addLog(new StringBuffer().append("<b>Established ").append(handshakeCompletedEvent.getSession().getProtocol()).append(" connection with ").append(val$host).append(":").append(this.val$port).append(" using ").append(handshakeCompletedEvent.getCipherSuite()).append("</b>").toString());
			//addLog(new StringBuffer().append("<b>Established ").append(handshakeCompletedEvent.getSession().getProtocol()).append(" connection ").append("using ").append(handshakeCompletedEvent.getCipherSuite()).append("</b>").toString());
			//addLog(new StringBuffer().append("Supported cipher suites: ").append(Arrays.toString(this.val$sslSocket.getSupportedCipherSuites())).toString());
			//addLog(new StringBuffer().append("Enabled cipher suites: ").append(Arrays.toString(this.val$sslSocket.getEnabledCipherSuites())).toString());
			// SkStatus.logInfo(new StringBuffer().append("SSL: Supported protocols: <br>").append(Arrays.toString(val$sslSocket.getSupportedProtocols())).toString().replace("[", "").replace("]", "").replace(",", "<br>"));
			SkStatus.logInfo(new StringBuffer().append("SSL: Protocolos ativos: <br>").append(Arrays.toString(val$sslSocket.getEnabledProtocols())).toString().replace("[", "").replace("]", "").replace(",", "<br>"));
			SkStatus.logInfo("SSL: Usando cipher " + handshakeCompletedEvent.getSession().getCipherSuite());
			SkStatus.logInfo("SSL: Usando protocolo " + handshakeCompletedEvent.getSession().getProtocol());
			SkStatus.logInfo("SSL: Handshake finished");

		}
	}
	private final String proxyHost;
	private final String proxyPass;
	private final int proxyPort;
	private final String proxyUser;
	private final String requestPayload;
	private boolean modoDropbear = false;




	private String stunnelServer;
	private int stunnelPort = 443;
	private String stunnelHostSNI;

	private Socket mSocket;


	static {
		try {
			Security.insertProviderAt(Conscrypt.newProvider(), 1);

		} catch (NoClassDefFoundError e) {
			e.printStackTrace();
		}}



	public SSL_PROXY_TUNNEL(String server, int port, String hostSni, String requestPayload, boolean modoDropbear, Context context) {
		this.stunnelServer = server;
		this.stunnelPort = port;
		this.stunnelHostSNI = hostSni;


		this.proxyHost = server;
		this.proxyPort = port;
		this.proxyUser = null;
		this.proxyPass = null;
		this.requestPayload = requestPayload;
		this.modoDropbear = modoDropbear;
		this.mContext = context;



	}

	@Override
	public Socket openConnection(String hostname, int port, int connectTimeout, int readTimeout) throws IOException
	{
		mSocket = SocketChannel.open().socket();
		mSocket.connect(new InetSocketAddress(stunnelServer, stunnelPort));

		if (mSocket.isConnected()) {
			mSocket = doSSLHandshake(hostname, stunnelHostSNI, stunnelPort);
		}

		String requestPayload = getRequestPayload(hostname, port);

		OutputStream out = mSocket.getOutputStream();

		// suporte a [split] na payload
		if (!TunnelUtils.injectSplitPayload(requestPayload, out)) {
			try {
				out.write(requestPayload.getBytes("ISO-8859-1"));
			} catch (UnsupportedEncodingException e2) {
				out.write(requestPayload.getBytes());
			}
			out.flush();
		}

		// suporta Dropbear (SSH + PAYLOAD)
		if (modoDropbear) {
			return mSocket;
		}

		byte[] buffer = new byte[1024];
		InputStream in = mSocket.getInputStream();

		// lê primeira linha
		int len = ClientServerHello.readLineRN(in, buffer);

		String httpReponseFirstLine = "";
		try {
			httpReponseFirstLine = new String(buffer, 0, len, "ISO-8859-1");
		} catch (UnsupportedEncodingException e3) {
			httpReponseFirstLine = new String(buffer, 0, len);
		}
		SkStatus.logInfo("<strong>" + httpReponseFirstLine + "</strong>");

		if (httpReponseFirstLine.contains("101")){
			httpReponseFirstLine = new String(new byte[]{72,84,84,80,47,49,46,49,32,50,48,48,32,79,75,});

			try {
				Thread.sleep(500);
			} catch (InterruptedException e) {}

			SkStatus.logInfo("<strong>" + httpReponseFirstLine + "</strong>");
		}



		// lê o restante
		String httpReponseAll = httpReponseFirstLine;
		while ((len = ClientServerHello.readLineRN(in, buffer)) != 0) {
			httpReponseAll += "\n";
			try {
				httpReponseAll += new String(buffer, 0, len, "ISO-8859-1");
			} catch (UnsupportedEncodingException e3) {
				httpReponseAll += new String(buffer, 0, len);
			}
		}

		if (!httpReponseAll.isEmpty())
			SkStatus.logDebug(httpReponseAll);

		if (!httpReponseFirstLine.startsWith("HTTP/")) {
			throw new IOException("The proxy did not send back a valid HTTP response.");
		} else if (httpReponseFirstLine.length() >= 14 && httpReponseFirstLine.charAt(8) == ' ' && httpReponseFirstLine.charAt(12) == ' ') {
			try {
				int errorCode = Integer.parseInt(httpReponseFirstLine.substring(9, 12));
				if (errorCode < 0 || errorCode > 999) {
					throw new IOException("The proxy did not send back a valid HTTP response.");
				} else if (errorCode != Packet.SSH_FXP_EXTENDED) {
					throw new HTTPProxyException(httpReponseFirstLine.substring(13), errorCode);
				} else {
					return mSocket;
				}
			} catch (NumberFormatException e4) {
				throw new IOException("The proxy did not send back a valid HTTP response.");
			}
		} else {
			throw new IOException("The proxy did not send back a valid HTTP response.");
		}
	}





	private String getRequestPayload(String hostname, int port) {
		String payload = this.requestPayload;

		if (payload != null) {
			payload = TunnelUtils.formatCustomPayload(hostname, port, payload);
		}
		else {
			StringBuffer sb = new StringBuffer();

			sb.append("CONNECT ");
			sb.append(hostname);
			sb.append(':');
			sb.append(port);
			sb.append(" HTTP/1.0\r\n");
			if (!(this.proxyUser == null || this.proxyPass == null)) {
				char[] encoded;
				String credentials = this.proxyUser + ":" + this.proxyPass;
				try {
					encoded = Base64.encode(credentials.getBytes("ISO-8859-1"));
				} catch (UnsupportedEncodingException e) {
					encoded = Base64.encode(credentials.getBytes());
				}
				sb.append("Proxy-Authorization: Basic ");
				sb.append(encoded);
				sb.append("\r\n");
			}
			sb.append("\r\n");

			payload = sb.toString();
		}

		return payload;

	}

	private SSLSocket doSSLHandshake(String host, String sni, int port) throws IOException {
		TrustManager[] trustAllCerts = new TrustManager[] {
				new X509TrustManager() {
					public java.security.cert.X509Certificate[] getAcceptedIssuers()
					{
						return null;
					}
					public void checkClientTrusted(
							java.security.cert.X509Certificate[] certs, String authType)
					{
					}
					public void checkServerTrusted(
							java.security.cert.X509Certificate[] certs, String authType)
					{
					}
				}
		};

		try {
			X509TrustManager tm = Conscrypt.getDefaultX509TrustManager();
			SSLContext sslContext = SSLContext.getInstance("TLS", "Conscrypt");
			sslContext.init(null, new TrustManager[] { tm }, null);

			TLSSocketFactory tsf = new TLSSocketFactory();
			SSLSocket socket = (SSLSocket) tsf.createSocket(host, port);
			/*SSLSocket socket = (SSLSocket) SSLSocketFactory.getDefault()
			 .createSocket(host, port);*/

			try {
				socket.getClass().getMethod("setHostname", String.class).invoke(socket, sni);

			} catch (Throwable e) {
				// ignore any error, we just can't set the hostname...
			}
			//MOSTRAR SNI EM DEBUG
			if (BuildConfig.DEBUG) {
				//MOSTRA PAYLOAD
				SkStatus.logInfo("Usando SNI: ...");
			}else{
				//NÃO MOSTRA PAYLOAD
				SkStatus.logInfo("Configurando SNI..." );
			}
			socket.setEnabledProtocols(socket.getSupportedProtocols());
			//socket.setEnabledCipherSuites(socket.getEnabledCipherSuites());
			socket.addHandshakeCompletedListener(new HandshakeTunnelCompletedListener(host, port, socket));
			SkStatus.logInfo("Iniciando SSL Handshake...");
			socket.startHandshake();
			return socket;
		} catch (Exception e) {
			IOException iOException = new IOException(new StringBuffer().append("Não foi possível concluir SSL handshake: ").append(e).toString());
			throw iOException;
		}
	}

	@Override
	public void close()
	{
		try {
			if (mSocket != null) {
				mSocket.close();
			}
		} catch(IOException e) {}
	}

}
