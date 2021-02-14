export default function SecuritySeals() {
    return (
        <div>
            <table
                width="135"
                border="0"
                cellPadding="2"
                cellSpacing="0"
                title="Click to Verify - This site chose Symantec SSL for secure e-commerce and confidential communications."
            >
                <tr>
                    <td width="135" align="center" valign="top">
                        <script
                            type="text/javascript"
                            src="https://seal.websecurity.norton.com/getseal?host_name=babadoo.herokuapp.com&amp;size=S&amp;use_flash=NO&amp;use_transparent=No&amp;lang=pt"
                        />
                        <br />
                        <a
                            rel="noopener noreferrer"
                            href="https://www.symantec.com/pt/br/ssl-certificates"
                            target="_blank"
                            style={{
                                color: "#000000",
                                textDecoration: "none",
                                font: "bold 10px verdana,sans-serif",
                                letterSpacing: ".5px;text-align:center",
                                margin: "0px",
                                padding: "0px",
                            }}
                        >
                            Sobre certificados SSL
                        </a>
                    </td>
                </tr>
            </table>
        </div>
    );
}
