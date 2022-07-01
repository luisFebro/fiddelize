package com.bsev700.ultrasshservice.config;

public interface SettingsConstants
{
	
	// Geral
	public static final String
		AUTO_CLEAR_LOGS_KEY = "autoClearLogs",
		HIDE_LOG_KEY = "hideLog",
		//MODO_DEBUG_KEY = "modeDebug",
		//MODO_NOTURNO_KEY = "modeNight",
		BLOQUEAR_ROOT_KEY = "blockRoot",
		IDIOMA_KEY = "idioma",
		TETHERING_SUBNET = "tetherSubnet",
		//SALVAR_PORTA = "salvaPorta",
	    WAKELOCK = "wakelock",
		DISABLE_DELAY_KEY = "disableDelaySSH",
		MAXIMO_THREADS_KEY = "numberMaxThreadSocks",
		
		FILTER_APPS = "filterApps",
		FILTER_BYPASS_MODE = "filterBypassMode",
		FILTER_APPS_LIST = "filterAppsList",
		
		PROXY_IP_KEY = "proxyRemoto",
		PROXY_PORTA_KEY = "proxyRemotoPorta",
		SSL_PORTA_KEY = "sslPorta",
		CUSTOM_PAYLOAD_KEY = "proxyPayload",
		PROXY_USAR_DEFAULT_PAYLOAD = "usarDefaultPayload",
		PROXY_USAR_AUTENTICACAO_KEY = "usarProxyAutenticacao"
	;
	
	public static final String
		CONFIG_PROTEGER_KEY = "protegerConfig",
		CONFIG_MENSAGEM_KEY = "mensagemConfig",
		CONFIG_VALIDADE_KEY = "validadeConfig",
		CONFIG_MENSAGEM_EXPORTAR_KEY = "mensagemConfigExport",
		CONFIG_INPUT_PASSWORD_KEY = "inputPassword"
	;

	// Vpn
	public static final String
	DNSFORWARD_KEY = "dnsForward",
	DNSRESOLVER1_KEY = "dnsResolver1",
	DNSRESOLVER2_KEY = "dnsResolver2",
	UDPFORWARD_KEY = "udpForward",
	UDPRESOLVER_KEY = "udpResolver";



	// SSH
	public static final String
	SERVIDOR_KEY = "sshServer",
	SERVIDOR_PORTA_KEY = "sshPort",
	USUARIO_KEY = "sshUser",
	SENHA_KEY = "sshPass",
	KEYPATH_KEY = "keyPath",
	PORTA_LOCAL_KEY = "sshPortaLocal",
	PINGER_KEY = "pingerSSH",
	ROTEAR_KEY = "chaveRotear";

	//SLOWDNS
	public static final String
			SLOW_CHAVE_KEY = "slowChave",
            SLOW_NAMESERVER_KEY = "slowNS",
			SLOW_DNSKEY= "slowDns",
	        SLOW_ATIVO= "slowAtivo";

	// Tunnel Type
	public static final String
		TUNNELTYPE_KEY = "tunnelType",
		TUNNEL_TYPE_SSH_DIRECT = "sshDirect",
		TUNNEL_TYPE_SSH_PROXY = "sshProxy",
		TUNNEL_TYPE_SSH_SSLTUNNEL = "sshSslTunnel";
	;
	
	public static final int
		bTUNNEL_TYPE_SSH_DIRECT = 1,
		bTUNNEL_TYPE_SSH_PROXY = 2,
		bTUNNEL_TYPE_SSH_SSLTUNNEL = 3,
	    bTUNNEL_TYPE_SSL_PROXY = 4
	;

	public static final String
			PAYLOAD_DEFAULT = "CONNECT [host_port] [protocol][crlf][crlf]",
			CUSTOM_SNI = "sslSNI";
}
